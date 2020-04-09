import { AWSError, DynamoDB } from 'aws-sdk';

const { AWS_ENDPOINT, DYNAMO_TABLE: TableName = 'todos' } = process.env;

interface Todo {
    id: string;
    userId: string;
    title: string;
    description?: string;
}

const client = new DynamoDB.DocumentClient({ endpoint: AWS_ENDPOINT });

export const getTodo = async (id: string, userId: string): Promise<Todo | null> =>
    client
        .get({
            TableName,
            Key: { userId, id },
        })
        .promise()
        .then(({ Item }) => (Item as Todo) || null);

export const listTodos = async (userId: string): Promise<Todo[]> =>
    client
        .query({
            TableName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: { ':userId': userId },
        })
        .promise()
        .then(({ Items }) => {
            return (Items || []) as Todo[];
        });

export const createTodo = async (item: Todo): Promise<Todo> =>
    client
        .put({
            TableName,
            Item: item,
            ConditionExpression: 'attribute_not_exists(id)',
        })
        .promise()
        .then(() => item);

export const updateTodo = async (item: Todo): Promise<Todo | null> =>
    client
        .put({
            TableName,
            Item: item,
            ConditionExpression: 'attribute_exists(id) AND :userId = userId',
            ExpressionAttributeValues: { ':userId': item.userId },
        })
        .promise()
        .then(() => item)
        .catch((error: AWSError) => {
            if (error.code === 'ConditionalCheckFailedException') {
                return null;
            }

            throw error;
        });

export const deleteTodo = async (id: string, userId: string): Promise<boolean> =>
    client
        .delete({
            TableName,
            Key: { id, userId },
            ConditionExpression: 'attribute_exists(id) AND :userId = userId',
            ExpressionAttributeValues: { ':userId': userId },
        })
        .promise()
        .then(() => true)
        .catch((error: AWSError) => {
            if (error.code === 'ConditionalCheckFailedException') {
                return false;
            }

            throw error;
        });
