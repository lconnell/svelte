/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Message } from '../models/Message';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UtilsService {
    /**
     * Test Email
     * Test emails.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static utilsTestEmail({
        emailTo,
    }: {
        emailTo: string,
    }): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/utils/test-email/',
            query: {
                'email_to': emailTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Health Check
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static utilsHealthCheck(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/utils/health-check/',
        });
    }
    /**
     * Ping
     * @returns string Successful Response
     * @throws ApiError
     */
    public static utilsPing(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/utils/ping',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Items
     * Retrieve items.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static utilsReadItems(): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/utils/items/',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
