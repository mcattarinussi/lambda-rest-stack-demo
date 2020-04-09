import { applyDefaultMiddleware } from '../../middlewares';
import { deleteTodo } from '../../db';

export const handler = applyDefaultMiddleware(async ({ id, userId }) => {
    const deleted = await deleteTodo(id as string, userId);
    return { statusCode: deleted ? 204 : 404 };
});
