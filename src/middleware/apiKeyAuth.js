const Channel = require('../models/Channel');

const apiKeyAuth = async (req, res, next) => {
    try {
        console.log("[DEBUG] Middleware: Checking API key...");
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            console.error("[ERROR] Missing API key");
            return res.status(401).json({ error: 'API key is required' });
        }
        const channel = await Channel.findOne({ apiKey });
        if (!channel) {
            console.error("[ERROR] Invalid API key");
            return res.status(401).json({ error: 'Invalid or Inactive API key' });
        }
        console.log("[DEBUG] Middleware: API key validated");
        req.channel = channel;
        next();
    } catch (err) {
        console.error("[ERROR] Middleware error:", err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

module.exports = apiKeyAuth;
