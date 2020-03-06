import { handler } from '.';

test('handler', async () => {
    await expect(handler()).resolves.toEqual({
        statusCode: 200,
        body: 'hey!!',
    });
});
