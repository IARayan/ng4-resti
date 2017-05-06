import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Headers, Http, RequestMethod, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * Represents an HTTP Request, using the underlying Http from \@angular/http
 */
var RestiCall = (function () {
    /**
     * @param {?=} options
     */
    function RestiCall(options) {
        this._queries = [];
        this._segments = [];
        this._headers = [];
        this._body = {};
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
    \@param {string} url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
    \@returns {RestiCall}
     * @param {?} url
     * @return {?}
     */
    RestiCall.prototype.url = function (url) {
        this._url = url;
        return this;
    };
    /**
     * Adds a query parameter to the URL of the request
    \@param name - Name of the query parameter
    \@param value - Value of the query parameter
    \@returns {RestiCall}
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    RestiCall.prototype.query = function (name, value) {
        this._queries.push({ name: name, value: value });
        return this;
    };
    /**
     * Sets the request method
    \@param method - HTTP Method to be used can be any of the RequestMethod enum
    \@returns {RestiCall}
    \@see RequestMethod
     * @param {?} method
     * @return {?}
     */
    RestiCall.prototype.method = function (method) {
        this._method = method;
        return this;
    };
    /**
     * Adds a segment to request URL
    \@param path - Path to be added to the URL
    \@returns {RestiCall}
     * @param {?} path
     * @return {?}
     */
    RestiCall.prototype.segment = function (path) {
        this._segments.push(path);
        return this;
    };
    /**
     * Adds a header to the request
    \@param name - Name of the header
    \@param value - Value of the header
    \@returns {RestiCall}
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    RestiCall.prototype.header = function (name, value) {
        this._headers.push({ name: name, value: value });
        return this;
    };
    /**
     * Adds data to the request body.
    \@param body - object to be added
    \@returns {RestiCall}
     * @param {?} body
     * @return {?}
     */
    RestiCall.prototype.body = function (body) {
        this._body = Object.assign(this._body, body);
        return this;
    };
    /**
     * Sets the underlying Http Client
    \@param http - Http Client, typically injected by Angular2/4 DI
    \@returns {RestiCall}
    \@see Http
     * @param {?} http
     * @return {?}
     */
    RestiCall.prototype.http = function (http) {
        this._http = http;
        return this;
    };
    /**
     * Sets the callback function that consumes the response.
    \@param {(result)=>void} callback - Callback function to handle the response
    \@returns {RestiCall}
    \@example
    let resti = new RestiCall({ url: '/path.json', this.http, RequestMethod.Get });
    resti.callback((result)=>{
             console.log(result);
         }).send();
     * @param {?} callback
     * @return {?}
     */
    RestiCall.prototype.callback = function (callback) {
        this._callback = callback;
        return this;
    };
    /**
     * Adds a transform function that applies to the request result before the callback.
    \@param {(res:Response)=>any} transform - Callback function to transform the response
    \@returns {RestiCall}
    \@example
    let resti = new RestiCall({ url: '/path.json', this.http, RequestMethod.Get });
    resti.transform((res: Response)=>{
             return res.json();
         }).send();
     * @param {?} transform
     * @return {?}
     */
    RestiCall.prototype.transform = function (transform) {
        this._transform = transform;
        return this;
    };
    /**
     * Sends the request, if a callback is provided then it's called.
    \@return {Observable<Response>|Subscription}
     * @return {?}
     */
    RestiCall.prototype.send = function () {
        var _this = this;
        // Format the url
        this.addURLSegments();
        this.addURLQueryParameters();
        // Set the request options
        this.setOptions();
        this._http.request(this._url, this._options).subscribe(function (res) { return _this.routeResponse(res); });
    };
    /**
     * Routes the response to the Transform and then routes the result to the Callback
    \@param res
    \@return {Response|any}
     * @param {?} res
     * @return {?}
     */
    RestiCall.prototype.routeResponse = function (res) {
        return this.callbackRoute(this.transformRoute(res));
    };
    /**
     * Routes the response to the Transform
    \@param res
    \@return {Response}
     * @param {?} res
     * @return {?}
     */
    RestiCall.prototype.transformRoute = function (res) {
        return this._transform ? this._transform(res) : res;
    };
    /**
     * Routes the response | transformed response to the Callback
    \@param result
    \@return {any}
     * @param {?} result
     * @return {?}
     */
    RestiCall.prototype.callbackRoute = function (result) {
        return this._callback ? this._callback(result) : result;
    };
    /**
     * Formats the URL segments of the request
     * @return {?}
     */
    RestiCall.prototype.addURLSegments = function () {
        if (!this._segments.length) {
            return;
        }
        if (!this._url.endsWith('/')) {
            this._url += '/';
        }
        for (var /** @type {?} */ i = 0; i < this._segments.length; i++) {
            this._url += encodeURIComponent(this._segments[i]) + '/';
        }
        this._url = this.clearLastIndexIf(this._url, '/');
    };
    /**
     * Formats the query parameters of the request
     * @return {?}
     */
    RestiCall.prototype.addURLQueryParameters = function () {
        if (!this._queries.length) {
            return;
        }
        this._url = this.clearLastIndexIf(this._url, '/') + '?';
        for (var /** @type {?} */ i = 0; i < this._queries.length; i++) {
            this._url += encodeURIComponent(this._queries[i].name) + '=' + encodeURIComponent(this._queries[i].value) + '&';
        }
        this._url = this.clearLastIndexIf(this._url, '&');
    };
    /**
     * Parses the headers from the RestiCall and returns a Header object
    \@return {Headers}
     * @return {?}
     */
    RestiCall.prototype.getHeaders = function () {
        var /** @type {?} */ headers = new Headers();
        for (var /** @type {?} */ i = 0; i < this._headers.length; i++) {
            headers.append(this._headers[i].name, this._headers[i].value);
        }
        return headers;
    };
    /**
     * Sets the RequestOptions for this request
     * @return {?}
     */
    RestiCall.prototype.setOptions = function () {
        this._options = new RequestOptions({ method: this._method, headers: this.getHeaders(), body: this._body });
    };
    /**
     * Clears the last index of a string if it matches the provided search parameter
    \@deprecated Looking for a better way to do this.
    \@param subject
    \@param search
    \@return {string}
     * @param {?} subject
     * @param {?} search
     * @return {?}
     */
    RestiCall.prototype.clearLastIndexIf = function (subject, search) {
        if (subject.endsWith(search)) {
            return subject.substring(0, subject.lastIndexOf(search));
        }
        return subject;
    };
    return RestiCall;
}());

var RestiService = (function () {
    /**
     * @param {?} http
     */
    function RestiService(http) {
        this.http = http;
        this.configurations = {};
    }
    /**
     * Sets the global configuration for all RestiCalls to consume
    \@param configurations
     * @param {?} configurations
     * @return {?}
     */
    RestiService.prototype.config = function (configurations) {
        this.configurations = Object.assign(this.configurations, configurations);
    };
    /**
     * Returns the current global configuration property or null if the configuration property doesn't exist
    \@param property - Name of the property to retrieve
    \@return {any|null}
     * @param {?} property
     * @return {?}
     */
    RestiService.prototype.getConfig = function (property) {
        return this.configurations.hasOwnProperty(property) ? this.configurations[property] : null;
    };
    /**
     * Creates a new GET RestiCall request
    \@param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
    \@return {RestiCall}
     * @param {?} url
     * @return {?}
     */
    RestiService.prototype.get = function (url) {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Get,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        });
    };
    /**
     * Creates a new HEAD RestiCall request
    \@param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
    \@return {RestiCall}
     * @param {?} url
     * @return {?}
     */
    RestiService.prototype.head = function (url) {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Head,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        });
    };
    /**
     * Creates a new DELETE RestiCall request
    \@param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
    \@return {RestiCall}
     * @param {?} url
     * @return {?}
     */
    RestiService.prototype.delete = function (url) {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Delete,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        });
    };
    /**
     * Creates a new OPTIONS RestiCall request
    \@param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
    \@return {RestiCall}
     * @param {?} url
     * @return {?}
     */
    RestiService.prototype.options = function (url) {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Options,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        });
    };
    /**
     * Creates a new POST RestiCall request
    \@param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
    \@param body - data of the request body if any.
    \@return {RestiCall}
     * @param {?} url
     * @param {?=} body
     * @return {?}
     */
    RestiService.prototype.post = function (url, body) {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Post,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        }).body(body);
    };
    /**
     * Creates a new PATCH RestiCall request
    \@param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
    \@param body - data of the request body if any.
    \@return {RestiCall}
     * @param {?} url
     * @param {?=} body
     * @return {?}
     */
    RestiService.prototype.patch = function (url, body) {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Patch,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        }).body(body);
    };
    /**
     * Creates a new PUT RestiCall request
    \@param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
    \@param body - data of the request body if any.
    \@return {RestiCall}
     * @param {?} url
     * @param {?=} body
     * @return {?}
     */
    RestiService.prototype.put = function (url, body) {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Put,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        }).body(body);
    };
    return RestiService;
}());
RestiService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
RestiService.ctorParameters = function () { return [
    { type: Http, },
]; };

var NgResti = (function () {
    function NgResti() {
    }
    /**
     * @return {?}
     */
    NgResti.forRoot = function () {
        return {
            ngModule: NgResti,
            providers: [RestiService]
        };
    };
    return NgResti;
}());
NgResti.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [],
                exports: []
            },] },
];
/**
 * @nocollapse
 */
NgResti.ctorParameters = function () { return []; };

export { NgResti, RestiService, RestiCall };
