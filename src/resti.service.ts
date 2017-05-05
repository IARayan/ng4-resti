import {Injectable} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
import {RestiCall} from './resti.call';

@Injectable()
export class RestiService {
    configurations: RestiConfigurations = {};

    constructor(private http: Http) {
    }

    /**
     * Sets the global configuration for all RestiCalls to consume
     * @param configurations
     */
    config(configurations: RestiConfigurations) {
        this.configurations = Object.assign(this.configurations, configurations);
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
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @return {RestiCall}
     */
    get(url: string): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Get,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        });
    }

    /**
     * Creates a new HEAD RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @return {RestiCall}
     */
    head(url: string): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Head,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        });
    }

    /**
     * Creates a new DELETE RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @return {RestiCall}
     */
    delete(url: string): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Delete,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        });
    }

    /**
     * Creates a new OPTIONS RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @return {RestiCall}
     */
    options(url: string): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Options,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        });
    }

    /**
     * Creates a new POST RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    post(url: string, body?: any): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Post,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        }).body(body);
    }

    /**
     * Creates a new PATCH RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    patch(url: string, body?: any): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Patch,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        }).body(body);
    }

    /**
     * Creates a new PUT RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    put(url: string, body?: any): RestiCall {
        return new RestiCall({
            url: this.getConfig('baseURL') ? this.getConfig('baseURL') + url : url,
            http: this.http,
            method: RequestMethod.Put,
            defaultTransform: this.getConfig('defaultTransform') ? this.getConfig('defaultTransform') : null,
            defaultCallback: this.getConfig('defaultCallback') ? this.getConfig('defaultCallback') : null
        }).body(body);
    }
}

export interface RestiConfigurations {
    baseURL?: string;
    defaultTransform?: (res: Response) => any;
    defaultCallback?: () => void;
}
