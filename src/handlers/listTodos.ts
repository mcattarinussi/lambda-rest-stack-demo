export const handler = async (): Promise<object> => ({
    statusCode: 200,
    body: JSON.stringify([
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
    ]),
});
