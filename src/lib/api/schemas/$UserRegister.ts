/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserRegister = {
    properties: {
        email: {
            type: 'string',
            isRequired: true,
            format: 'email',
            maxLength: 255,
        },
        password: {
            type: 'string',
            isRequired: true,
            maxLength: 40,
            minLength: 8,
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
    },
} as const;
