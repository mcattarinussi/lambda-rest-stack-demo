import { applyMiddleware } from '../../middleware';
import { listTodos } from '../../db';

export const handler = applyMiddleware(async ({ userId }) => {
    const todos = await listTodos(userId);

    return {
        statusCode: 200,
        data: todos,
    };
});
