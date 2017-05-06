import {RequestMethod, RequestOptions, Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * Represents an HTTP Request, using the underlying Http from @angular/http
 */
export class RestiCall {
    private _url: string;
    private _queries: { name: string, value: string }[] = [];
    private _segments: string[] = [];
    private _headers: { name: string, value: string }[] = [];
    private _method: RequestMethod;
    private _body: any = {};
    private _http: Http;
    private _callback: (result) => void;
    private _options: RequestOptions;
    private _transform: (res: Response) => any;

    constructor(options?: {
        url: string,
        http: Http,
        method: RequestMethod,
        defaultTransform?: (res: Response) => any,
        defaultCallback?: (result) => void
    }) {
        if (options) {
            this._url = options.url;
            this._http = options.http;
            this._method = options.method;
            if (options.defaultTransform) {
                this._transform = options.defaultTransform;
            }
            if (options.defaultCallback) {
                this._callback = options.defaultCallback;
            }
        }
    }

    /**
     *  Sets the URL to be called in this request
     * @param {string} url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
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
     * Adds a segment to request URL
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
     * Sets the callback function that consumes the response.
     * @param {(result)=>void} callback - Callback function to handle the response
     * @returns {RestiCall}
     * @example
     * let resti = new RestiCall({ url: '/path.json', this.http, RequestMethod.Get });
     * resti.callback((result)=>{
     *          console.log(result);
     *      }).send();
     */
    callback(callback: (result) => void): RestiCall {
        this._callback = callback;
        return this;
    }

    /**
     * Adds a transform function that applies to the request result before the callback.
     * @param {(res:Response)=>any} transform - Callback function to transform the response
     * @returns {RestiCall}
     * @example
     * let resti = new RestiCall({ url: '/path.json', this.http, RequestMethod.Get });
     * resti.transform((res: Response)=>{
     *          return res.json();
     *      }).send();
     */
    transform(transform: (res: Response) => any): RestiCall {
        this._transform = transform;
        return this;
    }

    /**
     * Sends the request, if a callback is provided then it's called.
     * @return {Observable<Response>|Subscription}
     */
    send(): Response | Observable<any> | any {
        // Format the url
        this.addURLSegments();
        this.addURLQueryParameters();
        // Set the request options
        this.setOptions();
        this._http.request(this._url, this._options).subscribe((res: Response) => this.routeResponse(res));
    }

    /**
     * Routes the response to the Transform and then routes the result to the Callback
     * @param res
     * @return {Response|any}
     */
    private routeResponse(res: Response): Response | any {
        return this.callbackRoute(this.transformRoute(res));
    }

    /**
     * Routes the response to the Transform
     * @param res
     * @return {Response}
     */
    private transformRoute(res: Response): Response | any {
        return this._transform ? this._transform(res) : res;
    }

    /**
     * Routes the response | transformed response to the Callback
     * @param result
     * @return {any}
     */
    private callbackRoute(result: Response | any): Response | any {
        return this._callback ? this._callback(result) : result;
    }

    /**
     * Formats the URL segments of the request
     */
    private addURLSegments() {
        if (!this._segments.length) {
            return;
        }
        if (!this._url.endsWith('/')) {
            this._url += '/';
        }
        for (let i = 0; i < this._segments.length; i++) {
            this._url += encodeURIComponent(this._segments[i]) + '/';
        }
        this._url = this.clearLastIndexIf(this._url, '/');
    }

    /**
     * Formats the query parameters of the request
     */
    private addURLQueryParameters() {
        if (!this._queries.length) {
            return;
        }
        this._url = this.clearLastIndexIf(this._url, '/') + '?';
        for (let i = 0; i < this._queries.length; i++) {
            this._url += encodeURIComponent(this._queries[i].name) + '=' + encodeURIComponent(this._queries[i].value) + '&';
        }
        this._url = this.clearLastIndexIf(this._url, '&');
    }

    /**
     * Parses the headers from the RestiCall and returns a Header object
     * @return {Headers}
     */
    private getHeaders(): Headers {
        let headers: Headers = new Headers();
        for (let i = 0; i < this._headers.length; i++) {
            headers.append(this._headers[i].name, this._headers[i].value);
        }
        return headers;
    }

    /**
     * Sets the RequestOptions for this request
     */
    private setOptions() {
        this._options = new RequestOptions({method: this._method, headers: this.getHeaders(), body: this._body});
    }

    /**
     * Clears the last index of a string if it matches the provided search parameter
     * @deprecated Looking for a better way to do this.
     * @param subject
     * @param search
     * @return {string}
     */
    private clearLastIndexIf(subject: string, search: string) {
        if (subject.endsWith(search)) {
            return subject.substring(0, subject.lastIndexOf(search));
        }
        return subject;
    }
}
