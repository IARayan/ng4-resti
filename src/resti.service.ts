import {Injectable} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
import {RestiCall} from './resti.call';

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
     * Creates a new HEAD RestiCall request
     * @param url - Url to be called, if a baseUrl is specified in the configuration this will be added after the baseUrl
     * @return {RestiCall}
     */
    head(url: string): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseUrl') ? this.getConfig('baseUrl') + url : url,
            http: this.http,
            method: RequestMethod.Head
        });
    }

    /**
     * Creates a new DELETE RestiCall request
     * @param url - Url to be called, if a baseUrl is specified in the configuration this will be added after the baseUrl
     * @return {RestiCall}
     */
    delete(url: string): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseUrl') ? this.getConfig('baseUrl') + url : url,
            http: this.http,
            method: RequestMethod.Delete
        });
    }

    /**
     * Creates a new OPTIONS RestiCall request
     * @param url - Url to be called, if a baseUrl is specified in the configuration this will be added after the baseUrl
     * @return {RestiCall}
     */
    options(url: string): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseUrl') ? this.getConfig('baseUrl') + url : url,
            http: this.http,
            method: RequestMethod.Options
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

    /**
     * Creates a new PATCH RestiCall request
     * @param url - Url to be called, if a baseUrl is specified in the configuration this will be added after the baseUrl
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    patch(url: string, body?: any): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseUrl') ? this.getConfig('baseUrl') + url : url,
            http: this.http,
            method: RequestMethod.Patch
        }).body(body);
    }

    /**
     * Creates a new PUT RestiCall request
     * @param url - Url to be called, if a baseUrl is specified in the configuration this will be added after the baseUrl
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    put(url: string, body?: any): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseUrl') ? this.getConfig('baseUrl') + url : url,
            http: this.http,
            method: RequestMethod.Put
        }).body(body);
    }
}

export interface RestiConfigurations {
    baseUrl: string;
}
