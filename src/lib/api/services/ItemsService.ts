/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemCreate } from '../models/ItemCreate';
import type { ItemPublic } from '../models/ItemPublic';
import type { ItemsPublic } from '../models/ItemsPublic';
import type { ItemUpdate } from '../models/ItemUpdate';
import type { Message } from '../models/Message';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemsService {
    /**
     * Read Items
     * Retrieve items.
     * @returns ItemsPublic Successful Response
     * @throws ApiError
     */
    public static itemsReadItems({
        skip,
        limit = 100,
    }: {
        skip?: number,
        limit?: number,
    }): CancelablePromise<ItemsPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/items/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Item
     * Create new item.
     * @returns ItemPublic Successful Response
     * @throws ApiError
     */
    public static itemsCreateItem({
        requestBody,
    }: {
        requestBody: ItemCreate,
    }): CancelablePromise<ItemPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/items/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Item
     * Get item by ID.
     * @returns ItemPublic Successful Response
     * @throws ApiError
     */
    public static itemsReadItem({
        id,
    }: {
        id: string,
    }): CancelablePromise<ItemPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/items/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Item
     * Update an item.
     * @returns ItemPublic Successful Response
     * @throws ApiError
     */
    public static itemsUpdateItem({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: ItemUpdate,
    }): CancelablePromise<ItemPublic> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/items/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Item
     * Delete an item.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static itemsDeleteItem({
        id,
    }: {
        id: string,
    }): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/items/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
