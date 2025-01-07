const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config");
const dotenv = require("dotenv");
const Channel = require("./models/Channel");

dotenv.config();
connectDB();

// Routes
const deviceRoutes = require("./routes/deviceRoutes");
const channelRoutes = require("./routes/channelRoutes");
const deductionRoutes = require("./routes/deductionRoutes");
const authenticationRoutes = require("./routes/authenticationRoutes");
const widgetRoutes = require("./routes/widgetRoutes");
const tradeInRoutes = require("./routes/tradeInRoutes");
const shopifyRoutes = require("./routes/shopifyRoutes");
const imeiRoutes = require("./routes/imeiRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Replace with specific origins if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true, // Ensure Safari sends cookies/credentials
  })
);

io.on("connection", (socket) => {
  console.log(`WebSocket connection established: ${socket.id}`);

  let isAlive = true;
  let apiKey = null;

  // Ping-Pong mechanism for heartbeat
  socket.on("pong", () => {
    isAlive = true;
  });

  // Authenticate client
  socket.on("authenticate", async (data) => {
    try {
      apiKey = data.apiKey;
      const channel = await Channel.findOne({ apiKey });
      if (channel) {
        channel.status = "Online";
        await channel.save();
        console.log(`Channel ${channel.name} authenticated`);
        socket.emit("authenticated", {
          status: "success",
          message: "Authenticated",
        });
      } else {
        socket.emit("error", { status: "error", message: "Invalid API key" });
      }
    } catch (err) {
      console.error("Error authenticating client:", err);
      socket.emit("error", {
        status: "error",
        message: "Authentication failed",
      });
    }
  });

  // Handle disconnection due to lack of pings
  const interval = setInterval(async () => {
    if (!isAlive) {
      console.log(`No heartbeat detected for socket ${socket.id}, disconnecting...`);
      socket.disconnect(true);

      if (apiKey) {
        const channel = await Channel.findOne({ apiKey });
        if (channel) {
          channel.status = "Offline";
          await channel.save();
          console.log(`Channel ${channel.name} disconnected due to heartbeat timeout.`);
        }
      }
      clearInterval(interval);
    }
    isAlive = false; // Reset for the next check
    socket.emit("ping");
  }, 30000); // 30 seconds interval

  // Handle explicit disconnection
  socket.on("disconnect", async () => {
    clearInterval(interval);
    console.log(`Socket disconnected: ${socket.id}`);

    if (apiKey) {
      const channel = await Channel.findOne({ apiKey });
      if (channel) {
        channel.status = "Offline";
        await channel.save();
        console.log(`Channel ${channel.name} disconnected.`);
      }
    }
  });
});


// Routes
app.use("/api", deviceRoutes);
app.use("/api", shopifyRoutes);
app.use("/api", channelRoutes);
app.use("/api", tradeInRoutes);
app.use("/api", deductionRoutes);
app.use("/api", widgetRoutes);
app.use("/api", imeiRoutes);
app.use("/auth", authenticationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
