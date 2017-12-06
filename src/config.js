const environment = process.env.NODE_ENV || 'development';

module.exports = {
  environment: environment,

  storage: {
    bucket: entry({
      key: 'STORAGE_BUCKET',
      doc: 'Bucket where the incoming data will be uploaded.',
      required: true,
    }),

    path: entry({
      key: 'STORAGE_PATH',
      doc: 'Base path where the incoming data will be uploaded.',
      required: true,
    }),
  },

  datastore: {
    namespace: entry({
      key: 'DATASTORE_NAMESPACE',
      doc: 'Namespace to scope all datastore operations to. On development this should be set to something unique to the user, such as "andres--ingest-api"',
      required: true,
    }),
  },


  server: {
    host: entry({
      key: 'SERVER_HOST',
      doc: 'Protocol, host and port where the server is exposed to clients.',
      defaults: {development: 'http://localhost:8080'},
      required: false,
    }),

    port: entry({
      key: 'PORT',
      doc: 'Port on which the server is exposed to clients.',
      defaults: {all: 8080},
      required: false,
    }),

    protocol: entry({
      key: 'SERVER_PROTOCOL',
      doc: 'Protocol by which the server is exposed to clients.',
      defaults: {development: 'http', production: 'https'},
      required: false,
    }),
  },

  log: {
    level: entry({
      key: 'LOG_LEVEL',
      doc: 'Logging level. In increasing amount of logs: error, warn, info, verbose, debug, silly',
      defaults: {development: 'debug', production: 'warn'},
      required: true,
    }),
  },

  gcloud: {
    storage: {
      projectId: entry({
        key: 'GCLOUD_PROJECTID_STORAGE',
        doc: 'Google cloud platform project id for the storage services.',
        defaults: {development: 'world-fishing-827'},
        required: true,
      }),

      keyFilename: entry({
        key: 'PELAGOS_GCLOUD_KEY_FILENAME',
        doc: 'Location of the json key file for authorizing with the storage services',
        defaults: {development: '/opt/project/dev/key.json'},
        required: false,
      }),
    },

    datastore: {
      projectId: entry({
        key: 'GCLOUD_PROJECTID_DATASTORE',
        doc: 'Google cloud platform project id for the datastore services.',
        defaults: {development: 'world-fishing-827', },
        required: true,
      }),

      keyFilename: entry({
        key: 'GCLOUD_KEY_FILENAME',
        doc: 'Location of the json key file for authorizing with the datastore services',
        defaults: {development: '/opt/project/dev/key.json'},
        required: false,
      }),
    },
  },
};

function errorMessage(key, doc) {
  return `You need to configure the environment variable ${key}. ${doc}`;
}

function entry(options) {
  let value = process.env[options.key];

  if (value === undefined && options.defaults) {
    value = options.defaults[environment];
  }

  if (value === undefined && options.defaults) {
    value = options.defaults.all;
  }

  if (value === undefined && options.required) {
    throw errorMessage(options.key, options.doc);
  }

  return value;
}
