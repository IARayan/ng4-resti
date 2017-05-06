import { RequestMethod, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/**
 * Represents an HTTP Request, using the underlying Http from @angular/http
 */
export declare class RestiCall {
    private _url;
    private _queries;
    private _segments;
    private _headers;
    private _method;
    private _body;
    private _http;
    private _callback;
    private _options;
    private _transform;
    constructor(options?: {
        url: string;
        http: Http;
        method: RequestMethod;
        defaultTransform?: (res: Response) => any;
        defaultCallback?: (result) => void;
    });
    /**
     *  Sets the URL to be called in this request
     * @param {string} url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @returns {RestiCall}
     */
    url(url: string): this;
    /**
     * Adds a query parameter to the URL of the request
     * @param name - Name of the query parameter
     * @param value - Value of the query parameter
     * @returns {RestiCall}
     */
    query(name: string, value: string): this;
    /**
     * Sets the request method
     * @param method - HTTP Method to be used can be any of the RequestMethod enum
     * @returns {RestiCall}
     * @see RequestMethod
     */
    method(method: RequestMethod): RestiCall;
    /**
     * Adds a segment to request URL
     * @param path - Path to be added to the URL
     * @returns {RestiCall}
     */
    segment(path: string): RestiCall;
    /**
     * Adds a header to the request
     * @param name - Name of the header
     * @param value - Value of the header
     * @returns {RestiCall}
     */
    header(name: string, value: string): RestiCall;
    /**
     * Adds data to the request body.
     * @param body - object to be added
     * @returns {RestiCall}
     */
    body(body: any): RestiCall;
    /**
     * Sets the underlying Http Client
     * @param http - Http Client, typically injected by Angular2/4 DI
     * @returns {RestiCall}
     * @see Http
     */
    http(http: Http): RestiCall;
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
    callback(callback: (result) => void): RestiCall;
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
    transform(transform: (res: Response) => any): RestiCall;
    /**
     * Sends the request, if a callback is provided then it's called.
     * @return {Observable<Response>|Subscription}
     */
    send(): Response | Observable<any> | any;
    /**
     * Routes the response to the Transform and then routes the result to the Callback
     * @param res
     * @return {Response|any}
     */
    private routeResponse(res);
    /**
     * Routes the response to the Transform
     * @param res
     * @return {Response}
     */
    private transformRoute(res);
    /**
     * Routes the response | transformed response to the Callback
     * @param result
     * @return {any}
     */
    private callbackRoute(result);
    /**
     * Formats the URL segments of the request
     */
    private addURLSegments();
    /**
     * Formats the query parameters of the request
     */
    private addURLQueryParameters();
    /**
     * Parses the headers from the RestiCall and returns a Header object
     * @return {Headers}
     */
    private getHeaders();
    /**
     * Sets the RequestOptions for this request
     */
    private setOptions();
    /**
     * Clears the last index of a string if it matches the provided search parameter
     * @deprecated Looking for a better way to do this.
     * @param subject
     * @param search
     * @return {string}
     */
    private clearLastIndexIf(subject, search);
}
