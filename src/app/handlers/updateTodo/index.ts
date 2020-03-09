import { applyMiddleware } from '../../middleware';
import { updateTodo } from '../../db';

export const handler = applyMiddleware(async ({ id, data, userId }) => {
    const item = await updateTodo({
        ...(data as { title: string; description?: string }),
        id: id as string,
        userId,
    });

    if (!item) {
        return { statusCode: 404 };
    }

    return {
        data: item,
        statusCode: 200,
    };
});
