import { HttpException, UnprocessableEntityException } from 'errors/http.error';
import * as Koa from 'koa';
import { logger } from 'logger';
const { errors } = require('auth-middleware');

const swaggerError2ValidationError = errors => ({
  fields: errors.map(error => ({
    field: error.path.join('.'),
    errors: [
      {
        code: 422,
        message: `${error.message}`,
      },
    ],
  })),

  general: [],
});

export async function errorMiddleware(
  ctx: Koa.ParameterizedContext,
  next: any,
) {
  try {
    await next();
  } catch (err) {
    logger.error('Error ', err);
    if (
      err instanceof HttpException ||
      err instanceof errors.ForbiddenException
    ) {
      if (err instanceof UnprocessableEntityException) {
        ctx.status = err.code;
        ctx.body = swaggerError2ValidationError(err.params);
      } else {
        ctx.throw(err.code, err.message);
      }
    } else {
      if (ctx.status === 400) {
        throw err;
      }
      ctx.throw(500, 'Generic error');
    }
  }
}
