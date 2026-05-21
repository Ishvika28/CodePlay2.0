const authRoutes = require("./routes/authRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const roomRoutes = require("./routes/roomRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const matchHistoryRoutes = require("./routes/matchHistoryRoutes");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");

const { Server } = require("socket.io");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://code-play2-0.vercel.app",
  credentials: true
}));

// =========================
// CREATE HTTP SERVER
// =========================

const server = http.createServer(app);

// =========================
// SOCKET.IO
// =========================

const io = new Server(server, {
  cors: {
    origin: "https://code-play2-0.vercel.app",
    methods: ["GET", "POST"]
  }
});

// Make io globally accessible
app.set("io", io);

// =========================
// SOCKET EVENTS
// =========================

io.on("connection", (socket) => {

  console.log("⚡ User connected:", socket.id);

  // Join contest room
  socket.on("joinRoom", (roomCode) => {

    socket.join(roomCode);

    console.log(`📡 Socket joined room: ${roomCode}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// =========================
// MONGODB
// =========================

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("MongoDB connected"))

.catch((err) => console.log(err));

// =========================
// ROUTES
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/problems", problemRoutes);

app.use("/api/submissions", submissionRoutes);

app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api/match-history", matchHistoryRoutes);

app.get("/", (req, res) => {
  res.send("Backend server running 🚀");
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});