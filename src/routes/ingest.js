module.exports = (app) => {
  app.post('/v1/ingest', (req, res) => {
    res.sendStatus(200);
  });
};

