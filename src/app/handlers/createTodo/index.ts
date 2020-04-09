import { v4 as uuidv4 } from 'uuid';

import { applyDefaultMiddleware } from '../../middlewares/';
import { createTodo } from '../../db';

export const handler = applyDefaultMiddleware(async ({ data, userId }) => {
    const item = await createTodo({
        ...(data as { title: string; description?: string }),
        id: uuidv4(),
        userId,
    });

    return { data: item, statusCode: 201 };
});
