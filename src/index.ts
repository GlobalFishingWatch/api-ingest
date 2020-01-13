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
const { koa } = require('auth-middleware');
const app = new Koa();

if (process.env.ENV === 'dev') {
  app.use(Logger());
}
app.use(Cors());
app.use(Body({ multipart: true }));
app.use(Helmet());
app.use(errorMiddleware);
app.use(koa.health());

app.use(ingestRouter.routes()).use(ingestRouter.allowedMethods());

app.listen(config.port, () => {
  logger.info(`Listening in port ${config.port}`);
});
