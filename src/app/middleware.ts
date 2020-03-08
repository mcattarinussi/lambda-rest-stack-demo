import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

export type WrappedHandler = (
    parsed: {
        id: string | null;
        data: object | null;
        userId: string;
    },
    event: APIGatewayProxyEvent,
    context: Context
) => Promise<{ data?: object; statusCode: number }>;

export const applyMiddleware = (handler: WrappedHandler) => async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const { body, requestContext, pathParameters } = event;

    const { id = null } = pathParameters || {};
    const requestData = body && JSON.parse(body);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId = requestContext!.authorizer!.claims!['cognito:username'];

    let data, statusCode;
    try {
        ({ data, statusCode } = await handler({ id, data: requestData, userId }, event, context));
    } catch (err) {
        console.log(err);

        return {
            statusCode: 500,
            body: 'Server Error',
        };
    }

    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
};
