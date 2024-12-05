const jwt = require('jsonwebtoken');
const Channel = require('../models/Channel');

// Admin login
const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    const adminCredentials = {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD
    };

    if (username === adminCredentials.username && password === adminCredentials.password) {
        const token = jwt.sign({ role: 'admin'}, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, role: 'admin', username });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
};

// Channel Login
const channelLoginStep1 = async (req, res) => {
    const { username, password } = req.body;

    try {
        const channel = await Channel.findOne({ name: username, password });
        if (!channel)
        {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Prompt for API key in the second step
        return res.status(200).json({ message: "Username and password verified", role: 'channel' });
    } catch (err)
    {
        return res.status(500).json({ message: 'Internal server error', details: err.message });
    }
};

const channelLoginStep2 = async (req, res) => {
    const { username, apiKey } = req.body;

    try {
        const channel = await Channel.findOne({ name: username });
        if (!channel || channel.apiKey !== apiKey)
        {
            return res.status(401).json({ error: "Invalid API Key" });
        }

        return res.status(200).json({ message: "Login successful", role: 'channel', channelId: channel._id, username: channel.name });
    } catch (err)
    {
        return res.status(500).json({ message: 'Internal server error', details: err.message });
    }
};

module.exports = {
    adminLogin,
    channelLoginStep1,
    channelLoginStep2
};