import 'reflect-metadata';
import * as Koa from 'koa';

import * as Logger from 'koa-logger';
import * as Body from 'koa-body';
import * as Helmet from 'koa-helmet';
import * as Cors from '@koa/cors';
import ingestRouter from 'route/ingest.router';
import { logger } from 'logger';
import { config } from 'config/config';
import { errorMiddleware } from 'middleware/error.middleware';

const app = new Koa();

if (process.env.ENV === 'dev') {
  app.use(Logger());
}
app.use(Cors());
app.use(Body());
app.use(Helmet());
app.use(errorMiddleware);

app.keys = [config.sessionSecret];
app.use(async (ctx, next) => {
  console.log(ctx.request.headers);
  await next();
});

app.use(ingestRouter.routes()).use(ingestRouter.allowedMethods());

app.listen(config.port, () => {
  logger.info(`Listening in port ${config.port}`);
});
