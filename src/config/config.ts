import { sanitizeEnvironment, entry } from './greenpeace';

const environments = {
  development: {
    inherits: ['all'],
  },

  test: {
    inherits: ['development', 'all'],
  },

  production: {
    inherits: ['all'],
  },
};

export const config = sanitizeEnvironment(environments, {
  log: {
    level: entry({
      key: 'LOG_LEVEL',
      doc: 'Logging level. In increasing amount of logs: error, warn, info, verbose, debug, silly',
      defaults: { all: 'debug' },
      required: true,
    }),
  },
  port: entry({
    key: 'PORT',
    doc: 'Listening port',
    defaults: { all: 3500 },
    required: true,
  }),
  lastVersionKey: entry({
    key: 'LAST_VERSION_KEY',
    doc: 'Version of the last key',
    defaults: { all: 'v1' },
    required: true,
  }),
  upload: {
    bucket: entry({
      key: 'UPLOAD_BUCKET',
      doc: 'Bucket to upload the files',
      defaults: { all: 'v1' },
      required: true,
    }),
    dir: entry({
      key: 'UPLOAD_DIR',
      doc: 'Dir of the bucket to upload the files',
      defaults: { all: 'v1' },
      required: true,
    }),
    project: entry({
      key: 'UPLOAD_PROJECT',
      doc: 'Project to upload the files',
      defaults: { all: '' },
      required: true,
    }),
  },
  keys: {
    v1: {
      privateKey: entry({
        key: 'PRIVATE_KEY',
        doc: 'Private key to decrypt positions',
        defaults: {},
        required: true,
      }),
      publicKey: entry({
        key: 'PUBLIC_KEY',
        doc: 'Public key to encrypt positions',
        defaults: {},
        required: true,
      }),
    },
  },
});
