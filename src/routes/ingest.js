const path = require('path');
const config = require('../config');
const authorization = require('../middleware/authorization');
const storage = require('../services/google/storage');
const log = require('../data/log').instance;

const bucket = storage.bucket(config.storage.bucket);

module.exports = (app) => {
  app.post('/v1/ingest', authorization.requiresAPIKey(), (req, res) => {
    log.debug("Validation for ingestion data succeeded");

    const fileName = `${new Date().toISOString()}.json`;

    const uploadPath = path.join(
      config.storage.path,
      req.authorization.key[1],
      fileName,
    );


    log.debug(`Uploading ingestion data to gs://${config.storage.bucket}/${uploadPath}`);
    const upload = bucket
      .file(uploadPath)
      .save(JSON.stringify(req.swagger.params.data.value));

    upload
      .then(() => {
        log.debug("Data uploaded successfully");
        res.sendStatus(200);
      })
      .catch((error) => {
        log.error("There was an error when uploading data", error);
        res.sendStatus(500);
      });
  });
};

