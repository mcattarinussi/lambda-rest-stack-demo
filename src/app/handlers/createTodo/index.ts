import { v4 as uuidv4 } from 'uuid';

import { applyMiddleware } from '../../middleware';
import { createTodo } from '../../db';

export const handler = applyMiddleware(async ({ data, userId }) => {
    const item = await createTodo({
        ...(data as { title: string; description?: string }),
        id: uuidv4(),
        userId,
    });

    return { data: item, statusCode: 201 };
});
