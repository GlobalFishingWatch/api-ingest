import { IngestService } from './../service/ingest.service';
import { logger } from 'logger';
import * as Router from 'koa-router';
import * as Koa from 'koa';
import { validatePositions } from 'validations/positions.validation';

const { koa } = require('auth-middleware');

class UserRouter {
  static async getPublicKey(ctx: Koa.ParameterizedContext) {
    logger.debug('Getting public key');
    ctx.body = IngestService.getLastPublicKey();
  }
  static async savePosition(ctx: Koa.ParameterizedContext) {
    let positions = ctx.request.body;
    const app = ctx.state.user;
    if (!ctx.query.encrypted || ctx.query.encrypted === 'true') {
      positions = await IngestService.decryptPositions(
        ctx.request.body,
        ctx.query['version-key'] as string,
      );
    }
    await validatePositions(positions);
    await IngestService.uploadPositions(app.id, positions);
    ctx.body = null;
  }
}

const router = new Router({
  prefix: '/ingest',
});

router.get(
  '/public-key',
  koa.obtainUser(true),
  koa.checkPermissions([{ action: 'read', type: 'entity', value: 'ingest' }]),
  UserRouter.getPublicKey,
);

router.post(
  '/position',
  koa.obtainUser(true),
  koa.checkPermissions([{ action: 'create', type: 'entity', value: 'ingest' }]),
  UserRouter.savePosition,
);
export default router;
