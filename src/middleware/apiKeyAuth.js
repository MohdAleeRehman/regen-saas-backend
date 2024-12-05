const Channel = require('../models/Channel');

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey)
    {
        return res.status(401).json({ error: 'API key is required' });
    }

    const channel = await Channel.findOne({ apiKey, status: 'active' });
    if (!channel)
    {
        return res.status(401).json({ error: 'Invalid or Inactive API key' });
    }

    req.channel = channel;
    next();
};

module.exports = apiKeyAuth;