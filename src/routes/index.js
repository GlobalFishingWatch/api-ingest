/* eslint-disable global-require */
const swagger = require('./swagger');
const ingest = require('./ingest');

module.exports = [
  swagger,
  ingest,
];
