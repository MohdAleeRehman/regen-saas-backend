const express = require('express');
const { handleShopifyIntegration } = require('../controllers/shopifyController');
const router = express.Router();

// Shopify integration route
router.post('/shopify-integration', handleShopifyIntegration);

module.exports = router;
