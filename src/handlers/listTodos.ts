import { applyMiddleware } from './middleware';

export const handler = applyMiddleware(async () => ({
    statusCode: 200,
    data: [
        {
            id: '1',
            title: 'My first TODO',
            details: 'An important thing to do.',
        },
        {
            id: '1',
            title: 'Second TODO',
            details: 'Another important thing to do.',
        },
    ],
}));
