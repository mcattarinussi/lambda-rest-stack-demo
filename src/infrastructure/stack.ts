import * as cdk from '@aws-cdk/core';

import { createAppAuth } from './appAuth';
import { createApi } from './api';
import { createDynamoTable } from './dynamo';

export class LambdaRestStackDemoStack extends cdk.Stack {
    constructor(scope: cdk.Construct) {
        super(scope, 'LambdaRestStackDemoStack');

        const { userPool, userPoolClient } = createAppAuth(this);
        const todosDynamoTable = createDynamoTable(this);

        createApi(this, { userPoolArn: userPool.userPoolArn, todosDynamoTable });

        new cdk.CfnOutput(this, 'userPoolId', {
            exportName: 'userPoolId',
            value: userPool.userPoolId,
        });

        new cdk.CfnOutput(this, 'userPoolClientId', {
            exportName: 'userPoolClientId',
            value: userPoolClient.userPoolClientId,
        });
    }
}
