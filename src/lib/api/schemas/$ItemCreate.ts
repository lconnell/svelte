/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ItemCreate = {
    properties: {
        title: {
            type: 'string',
            isRequired: true,
            maxLength: 255,
            minLength: 1,
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
