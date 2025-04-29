/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserUpdate = {
    properties: {
        email: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'email',
                maxLength: 255,
            }, {
                type: 'null',
            }],
        },
        is_active: {
            type: 'boolean',
        },
        is_superuser: {
            type: 'boolean',
        },
        full_name: {
            type: 'any-of',
            contains: [{
                type: 'string',
                maxLength: 255,
            }, {
                type: 'null',
            }],
        },
        password: {
            type: 'any-of',
            contains: [{
                type: 'string',
                maxLength: 40,
                minLength: 8,
            }, {
                type: 'null',
            }],
        },
    },
} as const;
