// ============================================================
//  FILE: controllers/clientController.js
//  ROLE: Logic for managing Clients
//  WHY THIS FILE EXISTS:
//    This runs when a user tries to Create, Read, Update, or
//    Delete a client. It only touches the database.
// ============================================================

const Client = require("../models/Client");

// @desc    Get all clients for the logged-in user
// @route   GET /api/clients
// @access  Private (Needs Token)
const getClients = async (req, res) => {
  try {
    // req.user.id comes from the authMiddleware! It only finds clients 
    // where the 'user' field matches the currently logged-in person.
    const clients = await Client.find({ user: req.user.id });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (Needs Token)
const createClient = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    if (!name || !email || !phone || !company) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Create the client and attach the logged-in user's ID
    const client = await Client.create({
      name,
      email,
      phone,
      company,
      user: req.user.id, 
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private (Needs Token)
const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Make sure the logged in user actually owns this client!
    // We convert ObjectIds to strings to compare them safely.
    if (client.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized to update this client" });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Returns the newly updated client, not the old one
    );

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private (Needs Token)
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Check ownership
    if (client.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized to delete this client" });
    }

    await client.deleteOne();

    res.json({ id: req.params.id, message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
