// This is the Vercel Serverless Function entry point.
// It wraps the Express backend app for the /api/* routes.
const app = require('../backend/server.js');

module.exports = app;
