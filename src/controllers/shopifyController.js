
const retryWithDelay = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retrying (${i + 1}/${retries}) after error:`, err.message);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

const handleShopifyIntegration = async (req, res) => {
  const { tradeInValue, device, shopifyCredentials, autoApplyDiscount } = req.body;

  try {
    console.log("Handling Shopify Integration:", { tradeInValue, device, autoApplyDiscount });

    const got = (await import("got")).default;

    const priceRuleResponse = await retryWithDelay(() =>
      got.post(
        `https://${shopifyCredentials.storeUrl}/admin/api/2024-10/price_rules.json`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${shopifyCredentials.apiKey}:${shopifyCredentials.accessToken}`
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
          json: {
            price_rule: {
              title: `Trade-In Discount - ${device.name}`,
              target_type: "line_item",
              target_selection: "all",
              allocation_method: "across",
              value_type: "fixed_amount",
              value: `-${tradeInValue}`,
              customer_selection: "all",
              starts_at: new Date().toISOString(),
              usage_limit: 1,
            },
          },
          responseType: "json",
        }
      )
    );

    const priceRuleId = priceRuleResponse.body.price_rule.id;

    // Step 2: Create a discount code
    const discountCode = `TRADEIN-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const discountCodeResponse = await got.post(
      `https://${shopifyCredentials.storeUrl}/admin/api/2024-10/price_rules/${priceRuleId}/discount_codes.json`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${shopifyCredentials.apiKey}:${shopifyCredentials.accessToken}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        json: {
          discount_code: {
            code: discountCode,
          },
        },
        responseType: "json",
      }
    );

    console.log("Discount Code Successfully Generated:", discountCodeResponse.body);

    res.status(200).json({ discountCode: discountCodeResponse.body.discount_code.code });
  } catch (error) {
    console.error("Error in Shopify Integration:", error.response?.body || error.message);
    res.status(error.response?.statusCode || 500).json({
      error: error.response?.body || "Shopify integration failed.",
    });
  }
};

module.exports = { handleShopifyIntegration };
