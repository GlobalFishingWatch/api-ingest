import { config } from 'config/config';
import * as crypto from 'crypto';
import { logger } from 'logger';
import { Storage } from '@google-cloud/storage';

Object.keys(config.keys).forEach(version => {
  config.keys[version].publicKeyDecode = Buffer.from(
    config.keys[version].publicKey,
    'base64',
  ).toString('ascii');
  config.keys[version].privateKeyDecode = Buffer.from(
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
    body: string[],
    versionKey: string = config.lastVersionKey,
  ): Promise<any[]> {
    let privateKey;
    if (config.keys[versionKey]) {
      privateKey = config.keys[versionKey].privateKeyDecode;
    }
    const res = body.map(item => {
      const buffer = Buffer.from(item);
      const decrypted = crypto.privateDecrypt(privateKey, buffer);
      return JSON.parse(decrypted.toString('utf8'));
    });

    return res;
  }

  static async uploadPositions(appId: number, positions: any[]): Promise<void> {
    logger.debug(`Uploading files to gcs (bucket: ${config.upload.bucket})`);

    const storage = new Storage();
    const bucket = storage.bucket(config.upload.bucket);
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      position.receiveDate = new Date().toISOString();
      const res = await bucket
        .file(
          `${config.upload.dir}/${appId}/${new Date().toISOString()}-${
            position.id
          }.json`,
        )
        .save(JSON.stringify(position), {
          resumable: false,
          metadata: {
            contentType: 'application/json',
          },
        });
    }
  }
}
