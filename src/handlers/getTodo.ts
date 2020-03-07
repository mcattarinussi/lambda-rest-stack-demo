import { applyMiddleware } from './middleware';

export const handler = applyMiddleware(async ({ id, userId }) => ({
    data: {
        id,
        userId,
        title: 'My first TODO',
        details: 'An important thing to do.',
    },
    statusCode: 200,
}));
