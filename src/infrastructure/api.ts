import path from 'path';

import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';
import { RestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType, IResource } from '@aws-cdk/aws-apigateway';

const createMethods = (scope: Construct, resource: IResource, methods: { method: string; name: string }[]): void =>
    methods.forEach(m => {
        const lambdaHandler = new lambda.Function(scope, `${m.name}Lambda`, {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: `${m.name}.handler`,
            code: lambda.Code.fromAsset(path.join(__dirname, '../handlers/')),
        });

        resource.addMethod(m.method, new LambdaIntegration(lambdaHandler));
    });

export const createApi = (scope: Construct, { userPoolArn }: { userPoolArn: string }): void => {
    const restapi = new RestApi(scope, 'restApi', { restApiName: 'TODO Rest API' });

    const authorizer = new CfnAuthorizer(scope, 'restApiAuthorizer', {
        restApiId: restapi.restApiId,
        name: 'TodoRestApiAuthorizer',
        type: 'COGNITO_USER_POOLS',
        identitySource: 'method.request.header.Authorization',
        providerArns: [userPoolArn],
    });

    const defaultMethodOptions = {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
            authorizerId: authorizer.ref,
        },
    };

    const todosResource = restapi.root.addResource('todos', { defaultMethodOptions });
    const todoResource = todosResource.addResource('{id}', { defaultMethodOptions });

    createMethods(scope, todosResource, [
        { method: 'GET', name: 'listTodos' },
        { method: 'POST', name: 'createTodo' },
    ]);
    createMethods(scope, todoResource, [
        { method: 'GET', name: 'getTodo' },
        { method: 'PUT', name: 'updateTodo' },
        { method: 'DELETE', name: 'deleteTodo' },
    ]);
};
