const datastore = require('../services/google/datastore');
const log = require('../data/log').instance;

const authorize = async (apiKey) => {
  log.debug("Authorizing request");

  if (!apiKey) {
    log.debug("No API key set in this request");
    return null;
  }

  const query = datastore
    .createQuery("IngestionClient")
    .filter('apiKey', '=', apiKey);

  log.debug("Running ingestion client query");
  const [results] = await datastore.runQuery(query);

  log.debug("Results ready");
  if (!results || results.length < 1 || !results[0]) {
    log.debug("No ingestion client available with this api key");
    return null;
  }

  log.debug("Found ingestion client with this api key");
  return results[0];
};

module.exports = {
  requiresAPIKey() {
    return (req, res, next) => {
      authorize(req.get('authorization'))
        .then((client) => {
          if (!client) {
            res.sendStatus(401);
          } else {
            req.authorization = client;
            next();
          }
        });
    };
  },
};

