import { APIGatewayEvent } from 'aws-lambda';

export const handler = async (_: APIGatewayEvent): Promise<any> => {
    return {
        statusCode: 200,
        body: "hey"
    }
}