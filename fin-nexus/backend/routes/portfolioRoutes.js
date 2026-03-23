const express = require("express");
const router = express.Router();
const {
  getPortfolio,
  getAssetDetails,
  getUserPortfolio,
  addAsset,
  updateAsset,
  deleteAsset,
  getAllPortfolios,
} = require("../controllers/portfolioController");
const { protect } = require("../middleware/authMiddleware");

// Apply the protect middleware to all routes in this file
// This ensures that only logged-in users with a valid token can access them

// GET all assets / POST new asset
router.route("/").get(protect, getPortfolio).post(protect, addAsset);

// GET community portfolios (summary of all users)
router.route("/all").get(protect, getAllPortfolios);

// GET recent community activity feed
router.route("/activity").get(protect, (req, res, next) => {
  const { getRecentActivity } = require("../controllers/portfolioController");
  getRecentActivity(req, res, next);
});

// GET a specific user's portfolio (public read for community members)
router.route("/user/:userId").get(protect, getUserPortfolio);

// GET single asset details / PUT update asset / DELETE remove asset
router.route("/:id").get(protect, getAssetDetails).put(protect, updateAsset).delete(protect, deleteAsset);

module.exports = router;
