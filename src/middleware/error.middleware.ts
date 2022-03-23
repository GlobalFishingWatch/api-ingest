import { CONSTANTS } from 'errors/constants';
import {
  UnauthorizedStandardException,
  UnprocessableEntityStandardException,
  ForbiddenStandardException,
  ServerUnavailableException,
} from 'errors/http-standard.error';
import * as Koa from 'koa';
import { logger } from 'logger';

const { errors } = require('auth-middleware');

const swaggerError2ValidationError = (errors) => ({
  fields: errors.map((error) => ({
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

function swaggerError2ValidationErrorV2(errors) {
  return errors.map((e) => {
    return {
      title: e.path.join('.'),
      detail: `${e.message}`,
    };
  });
}

function parseToV2Error(ctx, err) {
  switch (err.code) {
    case 401:
      ctx.status = CONSTANTS.statusCodes.unauthorized;
      ctx.body = new UnauthorizedStandardException(err.message);
      return;
    case 403:
      ctx.status = CONSTANTS.statusCodes.forbidden;
      ctx.body = new ForbiddenStandardException(err.message);
      return;
    case 422:
      ctx.status = CONSTANTS.statusCodes.unprocessableEntity;
      ctx.body = new UnprocessableEntityStandardException(
        swaggerError2ValidationErrorV2(err.params),
      );
      return;
    case 400:
      ctx.status = CONSTANTS.statusCodes.unprocessableEntity;
      ctx.body = new UnprocessableEntityStandardException([
        { title: 'body', detail: 'Body malformed' },
      ]);
      return;
    case 500:
      ctx.status = CONSTANTS.statusCodes.serviceUnavailable;
      ctx.body = new ServerUnavailableException(err.message);
      return;
  }
}

export async function errorMiddleware(
  ctx: Koa.ParameterizedContext,
  next: any,
) {
  try {
    await next();
  } catch (err) {
    logger.error('Error ', err);
    if (err instanceof errors.HttpException) {
      if (ctx.path.startsWith('/v2')) {
        parseToV2Error(ctx, err);
      } else {
        if (err instanceof errors.UnprocessableEntityException) {
          ctx.status = err.code;
          ctx.body = swaggerError2ValidationError(err.params);
        } else {
          ctx.throw(err.code, err.message);
        }
      }
    } else {
      if (ctx.status === 400) {
        throw err;
      }
      ctx.throw(500, 'Generic error');
    }
  }
}
