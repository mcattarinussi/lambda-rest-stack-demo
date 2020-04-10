import * as AWS from 'aws-sdk';

import { handler } from '.';

const event = {
    resource: '/todos/{id}',
    path: '/todos/33',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        Authorization: 'Bearer fake-user-token',
        'CloudFront-Forwarded-Proto': 'https',
        'CloudFront-Is-Desktop-Viewer': 'true',
        'CloudFront-Is-Mobile-Viewer': 'false',
        'CloudFront-Is-SmartTV-Viewer': 'false',
        'CloudFront-Is-Tablet-Viewer': 'false',
        'CloudFront-Viewer-Country': 'GB',
        Host: 'gpdrvodes8.execute-api.eu-west-1.amazonaws.com',
        'User-Agent': 'curl/7.54.0',
        Via: '2.0 9c078cf62ea8987c07cb33f6c4e5cb5e.cloudfront.net (CloudFront)',
        'X-Amz-Cf-Id': '_5GIccxnn5DvgnQEV9n0IqUfVdmw2WvDEZHkl0G0fU9f2gzeeA1OXA==',
        'X-Amzn-Trace-Id': 'Root=1-5e63d052-2cd282707aac57e01c55e800',
        'X-Forwarded-For': '86.15.202.133, 130.176.6.132',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https',
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        Authorization: ['Bearer fake-user-token'],
        'CloudFront-Forwarded-Proto': ['https'],
        'CloudFront-Is-Desktop-Viewer': ['true'],
        'CloudFront-Is-Mobile-Viewer': ['false'],
        'CloudFront-Is-SmartTV-Viewer': ['false'],
        'CloudFront-Is-Tablet-Viewer': ['false'],
        'CloudFront-Viewer-Country': ['GB'],
        Host: ['gpdrvodes8.execute-api.eu-west-1.amazonaws.com'],
        'User-Agent': ['curl/7.54.0'],
        Via: ['2.0 9c078cf62ea8987c07cb33f6c4e5cb5e.cloudfront.net (CloudFront)'],
        'X-Amz-Cf-Id': ['_5GIccxnn5DvgnQEV9n0IqUfVdmw2WvDEZHkl0G0fU9f2gzeeA1OXA=='],
        'X-Amzn-Trace-Id': ['Root=1-5e63d052-2cd282707aac57e01c55e800'],
        'X-Forwarded-For': ['86.15.202.133, 130.176.6.132'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https'],
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: {
        id: '33',
    },
    stageVariables: null,
    requestContext: {
        resourceId: 'vhm89g',
        authorizer: {
            claims: {
                /* eslint-disable @typescript-eslint/camelcase */
                sub: 'fe1402a4-89a8-4522-95e0-5e9f8849f1d2',
                aud: '3s5n6o6dvjm51if8lq8ulb0nmb',
                email_verified: 'true',
                event_id: '8bcfd5ea-63bf-4942-9c80-836677d1e369',
                token_use: 'id',
                auth_time: '1583599510',
                iss: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_N7xNB5quZ',
                'cognito:username': 'fe1402a4-89a8-4522-95e0-5e9f8849f1d2',
                exp: 'Sat Mar 07 17:45:10 UTC 2020',
                iat: 'Sat Mar 07 16:45:10 UTC 2020',
                email: 'mcattarinussi@gmail.com',
                /* eslint-enable @typescript-eslint/camelcase */
            },
        },
        resourcePath: '/todos/{id}',
        httpMethod: 'GET',
        extendedRequestId: 'JB181HV3joEF7Zw=',
        requestTime: '07/Mar/2020:16:48:18 +0000',
        path: '/prod/todos/56b3232f-08b3-4d9f-8869-f7af5159b012',
        accountId: '793051339466',
        protocol: 'HTTP/1.1',
        stage: 'prod',
        domainPrefix: 'gpdrvodes8',
        requestTimeEpoch: 1583599698030,
        requestId: 'df18fc2d-f2c7-409b-8d75-3173d96cad47',
        identity: {
            apiKey: null,
            apiKeyId: null,
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '86.15.202.133',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'curl/7.54.0',
            user: null,
        },
        domainName: 'gpdrvodes8.execute-api.eu-west-1.amazonaws.com',
        apiId: 'gpdrvodes8',
    },
    body: null,
    isBase64Encoded: false,
};

const context = {
    callbackWaitsForEmptyEventLoop: true,
    functionVersion: '$LATEST',
    functionName: 'LambdaRestStackDemoStack-getTodoLambda83F02851-RGNQ1A1VB8KR',
    memoryLimitInMB: '128',
    logGroupName: '/aws/lambda/LambdaRestStackDemoStack-getTodoLambda83F02851-RGNQ1A1VB8KR',
    logStreamName: '2020/03/07/[$LATEST]4db701230a9248739beff38b6a3d12c4',
    invokedFunctionArn:
        'arn:aws:lambda:eu-west-1:793051339466:function:LambdaRestStackDemoStack-getTodoLambda83F02851-RGNQ1A1VB8KR',
    awsRequestId: '9442078d-aa19-4f74-bd83-ca493fbb10e8',
    getRemainingTimeInMillis: (): number => 100,
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
};

jest.spyOn(AWS.DynamoDB.DocumentClient.prototype, 'get');

describe('getTodo', () => {
    it('should return 404 when the todo does not exists', async () => {
        (AWS.DynamoDB.DocumentClient.prototype.get as jest.Mock).mockReturnValueOnce({
            promise: jest.fn().mockResolvedValueOnce({ Item: undefined }),
        });

        await expect(handler(event, context)).resolves.toEqual({
            headers: {
                'Content-Type': 'application/json',
            },
            statusCode: 404,
        });
    });

    it('should return 200 and the todo item when the todo exists ', async () => {
        const todo = {
            id: '4d5242f5-e0c4-42d9-9e9c-e978445ebaa9',
            userId: 'fe1402a4-89a8-4522-95e0-5e9f8849f1d2',
            title: 'Test todo',
            description: 'An important thing to do!',
        };

        (AWS.DynamoDB.DocumentClient.prototype.get as jest.Mock).mockReturnValueOnce({
            promise: jest.fn().mockResolvedValueOnce({ Item: todo }),
        });

        await expect(handler(event, context)).resolves.toEqual({
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json',
            },
            statusCode: 200,
        });
    });
});
