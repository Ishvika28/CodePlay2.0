const Room = require("../models/Room")
const generateRoomCode = require("../utils/generateRoomCode")
const selectProblems = require("../utils/selectProblems")

// CREATE ROOM
const createRoom = async (req, res) => {
  try {
    const {
      roomName,
      difficulty = "any",
      topic = "any",
      problemCount = 3,
      duration = 30,
      maxParticipants = 10
    } = req.body

    const roomCode = await generateRoomCode()

    const problems = await selectProblems(
      difficulty,
      topic,
      problemCount
    )

    const room = await Room.create({
      roomName,
      roomCode,
      host: req.user._id,
      participants: [req.user._id],
      problems: problems.map(p => p._id),
      difficulty,
      topic,
      duration,
      maxParticipants
    })

    res.status(201).json(room)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// JOIN ROOM
const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body

    const room = await Room.findOne({ roomCode })

    if (!room) return res.status(404).json({ message: "Room not found" })

    if (room.status !== "waiting") {
      return res.status(400).json({ message: "Contest already started" })
    }

    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({ message: "Room full" })
    }

    if (!room.participants.includes(req.user._id)) {
      room.participants.push(req.user._id)
      await room.save()
    }

    res.json(room)

  } catch {
    res.status(500).json({ message: "Join failed" })
  }
}

// GET ROOM (SAFE)
const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.roomCode })
      .populate("participants", "name")
      .populate({
        path: "problems",
        select: "-hiddenTestCases"
      })

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    const isHost = room.host.toString() === req.user._id.toString()
    res.json({ ...room.toObject(), isHost })

  } catch {
    res.status(500).json({ message: "Error fetching room" })
  }
}

// START ROOM
const startRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.roomCode })

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only host can start" })
    }

    if (room.participants.length < 2) {
      return res.status(400).json({ message: "At least 2 participants required to start the match" })
    }

    room.status = "running"
    room.startTime = new Date()

    await room.save()

    res.json(room)

  } catch {
    res.status(500).json({ message: "Start failed" })
  }
}

const finishRoom = async (req, res) => {

  try {

    const room = await Room.findOne({
      roomCode: req.params.roomCode
    });

    if (!room) {

      return res.status(404).json({
        message: "Room not found"
      });
    }

    // Only host can finish contest
    if (
      room.host.toString()
      !== req.user._id.toString()
    ) {

      return res.status(403).json({
        message: "Only host can finish contest"
      });
    }

    room.status = "finished";

    await room.save();

    // SOCKET UPDATE
    const io = req.app.get("io");

    io.to(room.roomCode).emit(
      "contestEnded",
      {
        roomCode: room.roomCode
      }
    );

    res.json({
      message: "Contest finished successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to finish contest"
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  startRoom,
  finishRoom
}