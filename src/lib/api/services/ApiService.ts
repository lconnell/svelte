/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApiService {
    /**
     * Read Api Info
     * Get API info.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiReadApiInfo(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/info',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Api Version
     * Get API version.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiReadApiVersion(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/version',
            errors: {
                422: `Validation Error`,
            },
        });
    }
} 