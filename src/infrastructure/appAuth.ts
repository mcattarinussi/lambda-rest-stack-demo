import { Construct } from '@aws-cdk/core';
import { AuthFlow, UserPool, UserPoolClient } from '@aws-cdk/aws-cognito';

interface AppAuth {
    userPool: UserPool;
    userPoolClient: UserPoolClient;
}

export const createAppAuth = (scope: Construct): AppAuth => {
    const userPool = new UserPool(scope, 'userPool', {
        signInAliases: {
            email: true,
        },
    });

    const userPoolClient = new UserPoolClient(scope, 'userPoolClient', {
        enabledAuthFlows: [AuthFlow.USER_PASSWORD],
        userPool,
    });

    return { userPool, userPoolClient };
};
