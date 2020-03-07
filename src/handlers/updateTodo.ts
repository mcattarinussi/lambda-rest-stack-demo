import { applyMiddleware } from './middleware';

export const handler = applyMiddleware(async ({ id, data, userId }) => ({
    data: {
        id,
        userId,
        ...data,
    },
    statusCode: 200,
}));
