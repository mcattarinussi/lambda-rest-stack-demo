import { applyMiddleware } from '../../middleware';
import { deleteTodo } from '../../db';

export const handler = applyMiddleware(async ({ id, userId }) => {
    const deleted = await deleteTodo(id as string, userId);
    return { statusCode: deleted ? 204 : 404 };
});
