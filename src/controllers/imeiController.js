const axios = require("axios");
const IMEICheckModel = require("../models/IMEICheck");

const IMEICHECK_API_KEY = "nl5LS-62ZWS-13tXM-8BkQe-bAbZc-pkH4L";
const IMEICHECK_URL = "https://alpha.imeicheck.com/api/php-api/create";

const checkIMEI = async (req, res) => {
  const { imei, serviceId = 6 } = req.body; // Default serviceId for Blacklist Pro Check

  if (!imei || imei.length !== 15) {
    return res.status(400).json({ status: "error", message: "Invalid IMEI." });
  }

  try {
    const apiUrl = `${IMEICHECK_URL}?key=${IMEICHECK_API_KEY}&service=${serviceId}&imei=${imei}`;
    const { data } = await axios.get(apiUrl);

    const { status, result, object } = data;

    if (status === "success" && object) {
      const isBlacklisted =
        object.gsmaBlacklisted ||
        object.blacklistRecords > 0 ||
        object.generalliststatus;

      const imeiRecord = {
        imei: object.imei,
        status: isBlacklisted ? "blacklisted" : "clean",
        manufacturer: object.manufacturer,
        modelName: object.modelName,
        blacklistRecords: object.blacklistRecords || 0,
        gsmaBlacklisted: object.gsmaBlacklisted || false,
        generalListStatus: object.generalliststatus || false,
        result: object,
      };

      // Save IMEI and result to database
      await IMEICheckModel.create(imeiRecord);

      return res.json({
        status: imeiRecord.status,
        message: imeiRecord.status === "clean" ? "IMEI is clean." : "Device is blacklisted.",
        imeiRecord,
      });
    }

    return res.status(400).json({ status: "error", message: "IMEI check failed." });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = { checkIMEI };
