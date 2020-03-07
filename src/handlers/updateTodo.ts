import { APIGatewayEvent } from 'aws-lambda';

export const handler = async ({
    body,
    pathParameters: { id },
}: APIGatewayEvent & { pathParameters: { [k: string]: string } }): Promise<object> => ({
    statusCode: 200,
    body: JSON.stringify({
        id,
        ...(body
            ? JSON.parse(body)
            : {
                  title: 'My first TODO',
                  details: 'An important thing to do.',
              }),
    }),
});
