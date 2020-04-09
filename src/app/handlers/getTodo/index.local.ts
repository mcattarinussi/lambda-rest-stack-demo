import { applyMockAuthorizerMiddleware } from '../../middlewares';
import { handler as defaultHandler } from '.';

export const handler = applyMockAuthorizerMiddleware(defaultHandler);
