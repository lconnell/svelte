/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Message } from '../models/Message';
import type { UpdatePassword } from '../models/UpdatePassword';
import type { UserCreate } from '../models/UserCreate';
import type { UserPublic } from '../models/UserPublic';
import type { UserRegister } from '../models/UserRegister';
import type { UserUpdate } from '../models/UserUpdate';
import type { UsersPublic } from '../models/UsersPublic';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {
    /**
     * Read Users
     * Retrieve users.
     * @returns UserPublic[] Successful Response
     * @throws ApiError
     */
    public static usersReadUsers(): CancelablePromise<UserPublic[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
            errors: {
                422: `Validation Error`,
            },
        }).then((response: unknown) => {
            const usersResponse = response as UsersPublic;
            if (usersResponse && Array.isArray(usersResponse.data)) {
                return usersResponse.data;
            }
            throw new Error('Invalid response format from users API');
        }) as CancelablePromise<UserPublic[]>;
    }
    /**
     * Create User
     * Create new user.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersCreateUser({
        requestBody,
    }: {
        requestBody: UserCreate,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read User Me
     * Get current user.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersReadUserMe(): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
        });
    }
    /**
     * Delete User Me
     * Delete own user.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static usersDeleteUserMe(): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/me',
        });
    }
    /**
     * Update User Me
     * Update own user.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersUpdateUserMe({
        requestBody,
    }: {
        requestBody: UserUpdate,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Password Me
     * Update own password.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static usersUpdatePasswordMe({
        requestBody,
    }: {
        requestBody: UpdatePassword,
    }): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/me/password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Register User
     * Create new user without the need to be logged in.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersRegisterUser({
        requestBody,
    }: {
        requestBody: UserRegister,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read User By Id
     * Get a specific user by id.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersReadUserById({
        userId,
    }: {
        userId: number,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * Update a user.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersUpdateUser({
        userId,
        requestBody,
    }: {
        userId: number,
        requestBody: UserUpdate,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * Delete a user.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersDeleteUser({
        userId,
    }: {
        userId: number,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
