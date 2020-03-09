import { applyMiddleware } from '../../middleware';
import { getTodo } from '../../db';

export const handler = applyMiddleware(async ({ id, userId }) => {
    const item = await getTodo(id as string, userId);

    if (!item) {
        return { statusCode: 404 };
    }

    return {
        data: item,
        statusCode: 200,
    };
});
