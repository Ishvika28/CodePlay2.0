const authRoutes = require("./routes/authRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes")
const roomRoutes = require("./routes/roomRoutes")
const problemRoutes = require("./routes/problemRoutes")
const submissionRoutes = require("./routes/submissionRoutes")
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes)
app.use("/api/problems", problemRoutes)

app.use("/api/submissions", submissionRoutes)

app.use("/api/leaderboard", leaderboardRoutes)

app.get("/", (req, res) => {
    res.send("Backend server running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});