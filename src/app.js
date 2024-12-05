const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

// Routes
const deviceRoutes = require("./routes/deviceRoutes");
const channelRoutes = require("./routes/channelRoutes");
const deductionRoutes = require("./routes/deductionRoutes");
const authenticationRoutes = require("./routes/authenticationRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api', deviceRoutes);
app.use('/api', channelRoutes);
app.use('/api', deductionRoutes);
app.use('/auth', authenticationRoutes);

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});