import { applyMiddleware } from './middleware';

export const handler = applyMiddleware(async () => ({ statusCode: 204 }));
