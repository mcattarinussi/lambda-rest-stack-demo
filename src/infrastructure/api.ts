import path from 'path';

import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import { RestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType } from '@aws-cdk/aws-apigateway';

interface ApiProps {
    userPoolArn: string;
}

export const createApi = (scope: Construct, { userPoolArn }: ApiProps): void => {
    const heyLambda = new lambda.Function(scope, 'hey', {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../handlers/')),
    });

    const heyRestApi = new RestApi(scope, 'heyRestApi', {
        restApiName: 'Hey API',
    });

    const authorizer = new CfnAuthorizer(scope, 'cfnAuth', {
        restApiId: heyRestApi.restApiId,
        name: 'HeyAPIAuthorizer',
        type: 'COGNITO_USER_POOLS',
        identitySource: 'method.request.header.Authorization',
        providerArns: [userPoolArn],
    });

    heyRestApi.root.addResource('hey').addMethod('GET', new LambdaIntegration(heyLambda), {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
            authorizerId: authorizer.ref,
        },
    });
};
