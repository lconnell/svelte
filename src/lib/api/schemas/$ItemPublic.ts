/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ItemPublic = {
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
        id: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        owner_id: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        created_at: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
