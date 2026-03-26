// Vercel Serverless Function - wraps the Express backend
const app = require('../backend/server.js');

// Export as an explicit Vercel-compatible request handler
module.exports = (req, res) => {
    return app(req, res);
};
