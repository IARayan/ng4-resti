import { Http } from '@angular/http';
import { RestiCall } from './resti.call';
export declare class RestiService {
    private http;
    configurations: RestiConfigurations;
    constructor(http: Http);
    /**
     * Sets the global configuration for all RestiCalls to consume
     * @param configurations
     */
    config(configurations: RestiConfigurations): void;
    /**
     * Returns the current global configuration property or null if the configuration property doesn't exist
     * @param property - Name of the property to retrieve
     * @return {any|null}
     */
    getConfig(property: string): any;
    /**
     * Creates a new GET RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @return {RestiCall}
     */
    get(url: string): RestiCall;
    /**
     * Creates a new HEAD RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @return {RestiCall}
     */
    head(url: string): RestiCall;
    /**
     * Creates a new DELETE RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @return {RestiCall}
     */
    delete(url: string): RestiCall;
    /**
     * Creates a new OPTIONS RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @return {RestiCall}
     */
    options(url: string): RestiCall;
    /**
     * Creates a new POST RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    post(url: string, body?: any): RestiCall;
    /**
     * Creates a new PATCH RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    patch(url: string, body?: any): RestiCall;
    /**
     * Creates a new PUT RestiCall request
     * @param url - URL to be called, if a baseURL is specified in the configuration this will be added after the baseURL
     * @param body - data of the request body if any.
     * @return {RestiCall}
     */
    put(url: string, body?: any): RestiCall;
}
export interface RestiConfigurations {
    baseURL?: string;
    defaultTransform?: (res: Response) => any;
    defaultCallback?: () => void;
}
