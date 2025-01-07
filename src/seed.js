const mongoose = require("mongoose");
const Deduction = require("./models/Deduction");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/regen-saas", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateTradeInBonus = async () => {
  try {
    // Update documents for the specific channel IDs
    await Deduction.updateMany(
      { channelId: "677566746f6c48ff210234dd", tradeInBonus: { $exists: false } },
      { $set: { tradeInBonus: 7 } }
    );

    await Deduction.updateMany(
      { channelId: "676a810f771a45dd0624578c", tradeInBonus: { $exists: false } },
      { $set: { tradeInBonus: 0 } }
    );

    console.log("Documents updated successfully!");
  } catch (err) {
    console.error("Error updating documents:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Execute the function
updateTradeInBonus();
