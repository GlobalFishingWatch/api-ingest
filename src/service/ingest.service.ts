import { config } from 'config/config';
import * as crypto from 'crypto';
import { logger } from 'logger';
import { Storage } from '@google-cloud/storage';

Object.keys(config.keys).forEach(version => {
  config.keys[version].publicKeyDecode = new Buffer(
    config.keys[version].publicKey,
    'base64',
  ).toString('ascii');
  config.keys[version].privateKeyDecode = new Buffer(
    config.keys[version].privateKey,
    'base64',
  ).toString('ascii');
});

export class IngestService {
  static getLastPublicKey(): any {
    return {
      version: config.lastVersionKey,
      key: config.keys[config.lastVersionKey].publicKey,
    };
  }

  static async decryptPositions(
    body: string,
    versionKey: string = config.lastVersionKey,
  ): Promise<any[]> {
    let privateKey;
    if (config.keys[versionKey]) {
      privateKey = config.keys[versionKey].privateKeyDecode;
    }
    const buffer = Buffer.from(body, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return JSON.parse(decrypted.toString('utf8'));
  }

  static async uploadPositions(positions: any[]): Promise<void> {
    logger.debug(`Uploading files to gcs (bucket: ${config.bucket})`);
    const storage = new Storage();
    const bucket = storage.bucket(config.upload.bucket);
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const res = await bucket
        .file(`${config.upload.dir}/${position.id}-${Date.now()}`)
        .save(JSON.stringify(position), {
          metadata: {
            contentType: 'application/json',
          },
        });
    }
  }
}
