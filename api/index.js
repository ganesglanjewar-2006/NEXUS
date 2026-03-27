const app = require('../fin-nexus/backend/server.js');
module.exports = (req, res) => {
  return app(req, res);
};
