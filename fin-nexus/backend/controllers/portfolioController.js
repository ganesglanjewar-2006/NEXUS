const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

// @desc    Get user portfolio (all assets)
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  // Find all assets belonging to this user, sorted newest first
  const portfolio = await Portfolio.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(portfolio);
};

// @desc    Get single asset with full details + history
// @route   GET /api/portfolio/:id
// @access  Private (any logged-in user can VIEW, but only owner can EDIT)
const getAssetDetails = async (req, res) => {
  const asset = await Portfolio.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({ message: "Asset not found" });
  }

  // Any logged-in user can read asset details (community visibility)
  // Ownership is enforced on update/delete, not on read
  res.status(200).json(asset);
};

// @desc    Get a specific user's portfolio (public read for community)
// @route   GET /api/portfolio/user/:userId
// @access  Private (any logged-in user)
const getUserPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const assets = await Portfolio.find({ user: req.params.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
      },
      assets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user portfolio" });
  }
};

// @desc    Add asset to portfolio
// @route   POST /api/portfolio
// @access  Private
const addAsset = async (req, res) => {
  const { symbol, name, quantity, averagePrice, assetType } = req.body;

  if (!symbol || quantity === undefined || averagePrice === undefined || !assetType) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  // Check if asset already exists in user's portfolio
  const existingAsset = await Portfolio.findOne({ user: req.user.id, symbol });

  if (existingAsset) {
    return res.status(400).json({ message: "Asset already exists in portfolio. Update it instead." });
  }

  // Create asset with the first transaction in history
  const asset = await Portfolio.create({
    user: req.user.id,
    userName: req.user.name, // Save the owner's name
    symbol,
    name,
    quantity,
    averagePrice,
    assetType,
    // Record the initial purchase as the first history entry
    history: [
      {
        action: "BUY",
        quantity: Number(quantity),
        price: Number(averagePrice),
        date: new Date(),
        notes: "Initial purchase",
        userName: req.user.name, // Save who did it
      },
    ],
  });

  res.status(201).json(asset);
};

// @desc    Update asset (buy more shares or sell shares)
// @route   PUT /api/portfolio/:id
// @access  Private
const updateAsset = async (req, res) => {
  const asset = await Portfolio.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({ message: "Asset not found" });
  }

  if (asset.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { quantity, averagePrice, action, notes } = req.body;
  const newQty = Number(quantity);
  const newPrice = Number(averagePrice);

  // Record this transaction in history (date/time is auto-set)
  asset.history.push({
    action: action || "UPDATE",
    quantity: newQty,
    price: newPrice,
    date: new Date(),
    notes: notes || "",
    userName: req.user.name, // Save who did it
  });

  if (action === "BUY") {
// ... existing buy logic ...
    const oldTotal = asset.quantity * asset.averagePrice;
    const newTotal = newQty * newPrice;
    asset.quantity = asset.quantity + newQty;
    asset.averagePrice = parseFloat(((oldTotal + newTotal) / asset.quantity).toFixed(2));

  } else if (action === "SELL") {
// ... existing sell logic ...
    if (newQty > asset.quantity) {
      return res.status(400).json({ message: `Cannot sell ${newQty} shares. You only own ${asset.quantity}.` });
    }
    asset.quantity = asset.quantity - newQty;

  } else {
    if (quantity !== undefined) asset.quantity = newQty;
    if (averagePrice !== undefined) asset.averagePrice = newPrice;
  }

  const updatedAsset = await asset.save();
  res.status(200).json(updatedAsset);
};

// @desc    Delete asset from portfolio
// ... existing deleteAsset ...
const deleteAsset = async (req, res) => {
  const asset = await Portfolio.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({ message: "Asset not found" });
  }

  if (asset.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "User not authorized" });
  }

  await asset.deleteOne();

  res.status(200).json({ id: req.params.id, message: "Asset removed" });
};

// @desc    Get recent activities from all users (Social Feed)
// @route   GET /api/portfolio/activity
// @access  Private
const getRecentActivity = async (req, res) => {
  try {
    // Find all portfolios, but we only need the history
    const portfolios = await Portfolio.find({}).select("symbol history");
    
    // Flatten all history entries into one array
    let allActivities = [];
    portfolios.forEach(p => {
      p.history.forEach(h => {
        allActivities.push({
          symbol: p.symbol,
          userName: h.userName || "Unknown Investor",
          action: h.action,
          quantity: h.quantity,
          price: h.price,
          date: h.date,
          _id: h._id
        });
      });
    });

    // Sort by date descending and take top 15
    const recentActivity = allActivities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);

    res.status(200).json(recentActivity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching activity feed" });
  }
};

// @desc    Get all users' portfolio summaries (Community view)
// ... existing getAllPortfolios ...
const getAllPortfolios = async (req, res) => {
// ... existing code ...
  try {
    const users = await User.find({}).select("name"); // Only get names, not emails/passwords
    
    // For each user, get their portfolio assets
    const communityPortfolios = await Promise.all(
      users.map(async (user) => {
        const assets = await Portfolio.find({ user: user._id });
        
        if (assets.length === 0) return null; // Skip users with empty portfolios

        const totalValue = assets.reduce((sum, a) => sum + (a.quantity * a.averagePrice), 0);
        const stockCount = assets.filter(a => a.assetType === 'stock').length;
        const cryptoCount = assets.filter(a => a.assetType === 'crypto').length;
        
        // Find top asset by value
        let topAsset = null;
        if (assets.length > 0) {
          topAsset = assets.reduce((prev, current) => 
            ((prev.quantity * prev.averagePrice) > (current.quantity * current.averagePrice)) ? prev : current
          ).symbol;
        }

        return {
          userId: user._id,
          userName: user.name,
          totalValue,
          assetCount: assets.length,
          stockCount,
          cryptoCount,
          topAsset
        };
      })
    );

    // Filter out nulls and sort by total value desc
    const cleanedPortfolios = communityPortfolios
      .filter(p => p !== null)
      .sort((a, b) => b.totalValue - a.totalValue);

    res.status(200).json(cleanedPortfolios);
  } catch (err) {
    res.status(500).json({ message: "Error fetching community data" });
  }
};

module.exports = {
  getPortfolio,
  getAssetDetails,
  getUserPortfolio,
  addAsset,
  updateAsset,
  deleteAsset,
  getAllPortfolios,
  getRecentActivity,
};
