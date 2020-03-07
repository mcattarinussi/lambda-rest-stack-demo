import * as cdk from '@aws-cdk/core';

import { createAppAuth } from './appAuth';
import { createApi } from './api';

export class LambdaRestStackDemoStack extends cdk.Stack {
    constructor(scope: cdk.Construct) {
        super(scope, 'LambdaRestStackDemoStack');

        const { userPool, userPoolClient } = createAppAuth(this);

        createApi(this, { userPoolArn: userPool.userPoolArn });

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
