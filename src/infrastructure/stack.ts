import * as cdk from '@aws-cdk/core';

import { createAppAuth } from './appAuth';
import { createApi } from './api';
import { createDynamoTable } from './dynamo';

export class LambdaRestStackDemoStack extends cdk.Stack {
    constructor(scope: cdk.Construct) {
        super(scope, 'LambdaRestStackDemoStack');

        const {
            userPool: { userPoolArn, userPoolId },
            userPoolClient: { userPoolClientId },
        } = createAppAuth(this);

        const dynamoTableName = this.node.tryGetContext('dynamoTableName');

        if (dynamoTableName) {
            const dynamoTableArn = this.node.tryGetContext('dynamoTableArn');
            createApi(this, { userPoolArn, dynamoTableArn, dynamoTableName });
        } else {
            const { tableArn: dynamoTableArn, tableName: dynamoTableName } = createDynamoTable(this);
            createApi(this, { userPoolArn, dynamoTableName, dynamoTableArn });
        }

        new cdk.CfnOutput(this, 'userPoolId', {
            exportName: 'userPoolId',
            value: userPoolId,
        });

        new cdk.CfnOutput(this, 'userPoolClientId', {
            exportName: 'userPoolClientId',
            value: userPoolClientId,
        });
    }
}
