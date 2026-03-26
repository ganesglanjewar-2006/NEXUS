// Vercel Catch-All API Handler
// Handles ALL /api/* requests - Vercel routes them here preserving the original URL
const app = require('../backend/server.js');

module.exports = (req, res) => {
    return app(req, res);
};
