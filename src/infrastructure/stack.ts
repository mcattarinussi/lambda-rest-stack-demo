import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { LambdaRestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';

export class LambdaRestStackDemoStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const heyLambda = new lambda.Function(this, 'hey', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(
                '/Users/mattia.cattarinussi/code/github.com/mcattarinussi/lambda-rest-stack-demo/dist/handlers'
            ),
        });

        const heyRestApi = new LambdaRestApi(this, 'helloWorldLambdaRestApi', {
            restApiName: 'Hello World API',
            handler: heyLambda,
            proxy: false,
        });

        heyRestApi.root.addResource('hey').addMethod('GET', new LambdaIntegration(heyLambda));
    }
}
