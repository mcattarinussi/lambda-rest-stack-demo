import { APIGatewayEvent } from 'aws-lambda';

export const handler = async ({
    pathParameters: { id },
}: APIGatewayEvent & { pathParameters: { [k: string]: string } }): Promise<object> => ({
    statusCode: 200,
    body: JSON.stringify({
        id,
        title: 'My first TODO',
        details: 'An important thing to do.',
    }),
});
