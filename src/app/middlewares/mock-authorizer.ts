import { APIGatewayProxyWithCognitoAuthorizerEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export type AsyncHandler<TEvent, TResult> = (event: TEvent, context: Context) => Promise<TResult>;

type APIGatewayProxyWithCognitoAuthorizerAsyncHandler = AsyncHandler<
    APIGatewayProxyWithCognitoAuthorizerEvent,
    APIGatewayProxyResult
>;

type AuthMiddlewareWrapper = (
    handler: APIGatewayProxyWithCognitoAuthorizerAsyncHandler
) => APIGatewayProxyWithCognitoAuthorizerAsyncHandler;

export const applyMockAuthorizerMiddleware: AuthMiddlewareWrapper = handler => async (
    event,
    context
): Promise<APIGatewayProxyResult> => {
    if (!event.headers.Authorization) {
        return { body: 'Not authenticated', statusCode: 401 };
    }

    let claims;
    try {
        const match = event.headers.Authorization.match(/^Bearer .*\.(.*)\..*$/);

        if (!match) {
            throw Error(`Invalid Authorization header: ${event.headers.Authorization}`);
        }

        claims = JSON.parse(Buffer.from(match[1], 'base64').toString());
    } catch (err) {
        return { body: `Invalid authorization token. ${err}`, statusCode: 401 };
    }

    event.requestContext.authorizer = { claims };

    return handler(event, context);
};
