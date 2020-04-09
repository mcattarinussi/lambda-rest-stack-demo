import { applyDefaultMiddleware } from '../../middlewares';
import { listTodos } from '../../db';

export const handler = applyDefaultMiddleware(async ({ userId }) => {
    const todos = await listTodos(userId);

    return {
        statusCode: 200,
        data: todos,
    };
});
