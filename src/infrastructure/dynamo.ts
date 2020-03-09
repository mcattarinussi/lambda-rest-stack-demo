import { Construct } from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export const createDynamoTable = (scope: Construct): dynamodb.Table =>
    new dynamodb.Table(scope, 'TodoDynamoTable', {
        tableName: 'todos',
        partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });
