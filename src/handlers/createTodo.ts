import { APIGatewayEvent } from 'aws-lambda';

export const handler = async ({ body }: APIGatewayEvent): Promise<object> => ({
    statusCode: 201,
    body: JSON.stringify({
        id: '1',
        ...JSON.parse(body || '{}'),
    }),
});
