import { applyDefaultMiddleware } from '../../middlewares';
import { getTodo } from '../../db';

export const handler = applyDefaultMiddleware(async ({ id, userId }) => {
    const item = await getTodo(id as string, userId);

    if (!item) {
        return { statusCode: 404 };
    }

    return {
        data: item,
        statusCode: 200,
    };
});
