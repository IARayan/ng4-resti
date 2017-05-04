import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, RequestMethod, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class RestiService {
    configurations: RestiConfigurations = {baseUrl: ''};

    constructor(private http: Http) {
    }

    /**
     * Sets the global configuration for all RestiCalls to consume
     * @param configurations
     */
    config(configurations: RestiConfigurations) {
        this.configurations.baseUrl = configurations.baseUrl;
    }

    /**
     * Returns the current global configuration property or null if the configuration property doesn't exist
     * @param property - Name of the property to retrieve
     * @return {any|null}
     */
    getConfig(property: string) {
        return this.configurations.hasOwnProperty(property) ? this.configurations[property] : null;
    }

    /**
     * Creates a new GET RestiCall request
     * @param url - Url to be called, if a baseUrl is specified in the configuration this will be added after the baseUrl
     * @return {RestiCall}
     */
    get(url: string): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseUrl') ? this.getConfig('baseUrl') + url : url,
            http: this.http,
            method: RequestMethod.Get
        });
    }

    /**
     * Creates a new POST RestiCall request
     * @param url - Url to be called, if a baseUrl is specified in the configuration this will be added after the baseUrl
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    post(url: string, body?: any): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseUrl') ? this.getConfig('baseUrl') + url : url,
            http: this.http,
            method: RequestMethod.Post
        }).body(body);
    }

}

export class RestiCall {
    private _url: string;
    private _queries: { name: string, value: string }[] = [];
    private _segments: string[] = [];
    private _headers: { name: string, value: string }[] = [];
    private _method: RequestMethod;
    private _body: any = {};
    private _http: Http;
    private _callback: (res: Response) => void;
    private _options: RequestOptions;

    constructor(options: { url: string, http: Http, method: RequestMethod }) {
        if (options) {
            this._url = options.url;
            this._http = options.http;
            this._method = options.method;
        }
    }

    /**
     *  Sets the URL to be called in this request
     * @param {string} url - Url to be called, if a baseUrl is specified in the configuration this will be added after the baseUrl
     * @returns {RestiCall}
     */
    url(url: string) {
        this._url = url;
        return this;
    }

    /**
     * Adds a query parameter to the URL of the request
     * @param name - Name of the query parameter
     * @param value - Value of the query parameter
     * @returns {RestiCall}
     */
    query(name: string, value: string) {
        this._queries.push({name: name, value: value});
        return this;
    }

    /**
     * Sets the request method
     * @param method - HTTP Method to be used can be any of the RequestMethod enum
     * @returns {RestiCall}
     * @see RequestMethod
     */
    method(method: RequestMethod): RestiCall {
        this._method = method;
        return this;
    }

    /**
     * Adds a segment to request URI
     * @param path - Path to be added to the URL
     * @returns {RestiCall}
     */
    segment(path: string): RestiCall {
        this._segments.push(path);
        return this;
    }

    /**
     * Adds a header to the request
     * @param name - Name of the header
     * @param value - Value of the header
     * @returns {RestiCall}
     */
    header(name: string, value: string): RestiCall {
        this._headers.push({name: name, value: value});
        return this;
    }

    /**
     * Adds data to the request body.
     * @param body - object to be added
     * @returns {RestiCall}
     */
    body(body: any): RestiCall {
        this._body = Object.assign(this._body, body);
        return this;
    }

    /**
     * Sets the underlying Http Client
     * @param http - Http Client, typically injected by Angular2/4 DI
     * @returns {RestiCall}
     * @see Http
     */
    http(http: Http): RestiCall {
        this._http = http;
        return this;
    }

    /**
     * Sets the callback function that consumes the request result.
     * @param {(res:Response)=>any} callback - Callback function to handle the request
     * @returns {RestiCall}
     * @example
     * let resti = new RestiCall({ url: '/path.json', this.http, RequestMethod.Get });
     * resti.callback((res: Response)=>{
     *          console.log(res.json());
     *      }).send();
     */
    callback(callback: (res: Response) => any): RestiCall {
        this._callback = callback;
        return this;
    }

    /**
     * Sends the request, if a callback is provided it calls it,
     * otherwise you must subscribe to the result of this function.
     * @return {Observable<Response>|Subscription}
     */
    send(): Observable<any> | Subscription {
        // Format the url
        this.addUrlSegments();
        this.addUrlQueryParameters();
        this.setOptions();
        if (this._callback) {
            return this._http.request(this._url, this._options).subscribe(this._callback);
        } else {
            return this._http.request(this._url, this._options);
        }
    }

    private addUrlSegments() {
        if (!this._segments.length) {
            return;
        }
        this._url = this.clearLastIndexOf(this._url, '/') + '?';
        for (let i = 0; i < this._segments.length; i++) {
            this._url = this._segments[i] + '/';
        }
        this._url = this.clearLastIndexOf(this._url, '/');
    }

    private addUrlQueryParameters() {
        if (!this._queries.length) {
            return;
        }
        this._url = this.clearLastIndexOf(this._url, '/') + '?';
        for (let i = 0; i < this._queries.length; i++) {
            this._url += this._queries[i].name + '=' + this._queries[i].value + '&';
        }
        this._url = this.clearLastIndexOf(this._url, '&');
    }

    private getHeaders(): Headers {
        let headers: Headers = new Headers();
        for (let i = 0; i < this._headers.length; i++) {
            headers.append(this._headers[i].name, this._headers[i].value);
        }
        return headers;
    }

    private setOptions() {
        this._options = new RequestOptions({method: this._method, headers: this.getHeaders(), body: this._body});
    }

    private clearLastIndexOf(subject: string, search: string) {
        if (subject.endsWith(search)) {
            return subject.substring(0, this._url.lastIndexOf(search));
        }
        return subject;
    }
}
export interface RestiConfigurations {
    baseUrl: string;
}
