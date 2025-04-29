/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ItemUpdate = {
    properties: {
        title: {
            type: 'any-of',
            contains: [{
                type: 'string',
                maxLength: 255,
                minLength: 1,
            }, {
                type: 'null',
            }],
        },
        description: {
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
