import { IngestService } from './../service/ingest.service';
import { logger } from 'logger';
import * as Router from 'koa-router';
import * as Koa from 'koa';
import { userMiddleware } from 'middleware/user.middleware';
import { permissionMiddleware } from 'middleware/permission.middleware';
import { NotFoundException } from 'errors/http.error';
import { config } from 'config/config';

class UserRouter {
  static async getPublicKey(ctx: Koa.ParameterizedContext) {
    logger.debug('Getting public key');
    ctx.body = IngestService.getLastPublicKey();
  }
  static async savePosition(ctx: Koa.ParameterizedContext) {
    let positions = ctx.request.body;
    if (ctx.query.encrypted && ctx.query.encrypted === 'true') {
      positions = await IngestService.decryptPositions(
        ctx.request.body,
        ctx.query['version-key'],
      );
    }
    await IngestService.uploadPositions(positions);
    ctx.body = positions;
  }
}

const router = new Router({
  prefix: '/ingest',
});

router.get(
  '/public-key',
  userMiddleware,
  permissionMiddleware([{ action: 'read', type: 'entity', value: 'ingest' }]),
  UserRouter.getPublicKey,
);

router.post(
  '/position',
  userMiddleware,
  permissionMiddleware([{ action: 'create', type: 'entity', value: 'ingest' }]),
  UserRouter.savePosition,
);
export default router;
