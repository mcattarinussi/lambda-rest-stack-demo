import { applyMiddleware } from './middleware';

export const handler = applyMiddleware(async ({ data, userId }) => ({
    data: {
        id: '1',
        userId,
        ...data,
    },
    statusCode: 200,
}));
