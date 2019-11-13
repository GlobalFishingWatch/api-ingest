import { ForbiddenException } from 'errors/http.error';
import * as Koa from 'koa';
import { logger } from 'logger';
import * as rp from 'request-promise';
import { config } from 'config/config';
import { url } from 'koa-router';

export function permissionMiddleware(permissions: any[]) {
  return async (ctx: Koa.ParameterizedContext, next: any) => {
    logger.debug('Checking permissions', permissions);

    const id = ctx.state.user.id;
    const type = ctx.state.user.type;
    let has = false;
    for (let i = 0; i < permissions.length; i++) {
      try {
        const permission = permissions[i];
        const url = `${config.auth.url}/v2/permission/${id}/${type}/has/${permission.action}/${permission.type}/${permission.value}`;
        const options = {
          uri: url,
          headers: {
            Authorization: `Bearer ${config.auth.token}`,
          },
          json: true,
        };
        await rp(options);
        has = true;
        break;
      } catch (err) {}
    }

    if (!has) {
      throw new ForbiddenException('Not authorized');
    }
    await next();
  };
}
