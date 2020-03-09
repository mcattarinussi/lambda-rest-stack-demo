import path from 'path';

import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { Construct } from '@aws-cdk/core';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { RestApi, LambdaIntegration, CfnAuthorizer, AuthorizationType, IResource } from '@aws-cdk/aws-apigateway';

interface ApiMethodConfig {
    method: string;
    name: string;
    environment?: { [k: string]: string };
    policies?: PolicyStatement[];
}

const createMethods = (scope: Construct, resource: IResource, methods: ApiMethodConfig[]): void =>
    methods.forEach(({ name, method, environment, policies }) => {
        const lambdaHandler = new lambda.Function(scope, `${name}Lambda`, {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../app/handlers', name)),
            environment,
        });

        (policies || []).forEach(p => lambdaHandler.addToRolePolicy(p));

        resource.addMethod(method, new LambdaIntegration(lambdaHandler));
    });

const createLambdaPolicies = (todosDynamoTableArn: string): PolicyStatement[] => [
    new PolicyStatement({
        resources: [todosDynamoTableArn],
        actions: [
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
        ],
    }),
];

export const createApi = (
    scope: Construct,
    { userPoolArn, todosDynamoTable }: { userPoolArn: string; todosDynamoTable: dynamodb.Table }
): void => {
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

    const environment = { DYNAMO_TABLE: todosDynamoTable.tableName };
    const policies = createLambdaPolicies(todosDynamoTable.tableArn);

    const todosResource = restapi.root.addResource('todos', { defaultMethodOptions });
    const todoResource = todosResource.addResource('{id}', { defaultMethodOptions });

    createMethods(scope, todosResource, [
        { method: 'GET', name: 'listTodos', environment, policies },
        { method: 'POST', name: 'createTodo', environment, policies },
    ]);
    createMethods(scope, todoResource, [
        { method: 'GET', name: 'getTodo', environment, policies },
        { method: 'PUT', name: 'updateTodo', environment, policies },
        { method: 'DELETE', name: 'deleteTodo', environment, policies },
    ]);
};
