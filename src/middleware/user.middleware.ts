import { UnauthorizedException } from 'errors/http.error';
import * as Koa from 'koa';
import { logger } from 'logger';

export async function userMiddleware(ctx: Koa.ParameterizedContext, next: any) {
  try {
    ctx.state.user = JSON.parse(ctx.request.header.user);
  } catch (err) {
    logger.error('Error parsing header user', err);
    throw new UnauthorizedException('Not authorized');
  }
  await next();
}
