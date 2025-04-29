/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrivateUserCreate } from '../models/PrivateUserCreate';
import type { UserPublic } from '../models/UserPublic';
import type { Message } from '../models/Message';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PrivateService {
    /**
     * Create User
     * Create a new user.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static privateCreateUser({
        requestBody,
    }: {
        requestBody: PrivateUserCreate,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/private/users/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Private
     * @returns string Successful Response
     * @throws ApiError
     */
    public static privateReadPrivate(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/private',
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
    public static privateReadItems(): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/private/items/',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
