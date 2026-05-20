const Room = require("../models/Room");
const generateRoomCode = require("../utils/generateRoomCode");
const selectProblems = require("../utils/selectProblems");

// NEW IMPORTS
const prisma = require("../prisma/prismaClient");
const Submission = require("../models/Submission");

// CREATE ROOM
const createRoom = async (req, res) => {
  try {
    const {
      roomName,
      difficulty = "any",
      topic = "any",
      problemCount = 3,
      duration = 30,
      maxParticipants = 10,
    } = req.body;

    const roomCode = await generateRoomCode();

    const problems = await selectProblems(
      difficulty,
      topic,
      problemCount
    );

    const room = await Room.create({
      roomName,
      roomCode,
      host: req.user._id,
      participants: [req.user._id],
      problems: problems.map((p) => p._id),
      difficulty,
      topic,
      duration,
      maxParticipants,
    });

    res.status(201).json(room);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// JOIN ROOM
const joinRoom = async (req, res) => {

  try {

    const { roomCode } = req.body;

    const room = await Room.findOne({
      roomCode,
    });

    if (!room) {

      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.status !== "waiting") {

      return res.status(400).json({
        message: "Contest already started",
      });
    }

    if (
      room.participants.length >=
      room.maxParticipants
    ) {

      return res.status(400).json({
        message: "Room full",
      });
    }

    const alreadyJoined =
      room.participants.some(
        (p) =>
          p.toString() ===
          req.user._id.toString()
      );

    if (!alreadyJoined) {

      room.participants.push(
        req.user._id
      );

      await room.save();
    }

    res.json(room);

  } catch {

    res.status(500).json({
      message: "Join failed",
    });
  }
};

// GET ROOM
const getRoom = async (req, res) => {

  try {

    const room = await Room.findOne({
      roomCode: req.params.roomCode,
    })

      .populate(
        "participants",
        "name"
      )

      .populate({
        path: "problems",
        select: "-hiddenTestCases",
      });

    if (!room) {

      return res.status(404).json({
        message: "Room not found",
      });
    }

    const isHost =
      room.host.toString() ===
      req.user._id.toString();

    res.json({
      ...room.toObject(),
      isHost,
    });

  } catch {

    res.status(500).json({
      message: "Error fetching room",
    });
  }
};

// START ROOM
const startRoom = async (req, res) => {

  try {

    const room = await Room.findOne({
      roomCode: req.params.roomCode,
    });

    if (!room) {

      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (
      room.host.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "Only host can start",
      });
    }

    if (
      room.participants.length < 2
    ) {

      return res.status(400).json({
        message:
          "At least 2 participants required to start the match",
      });
    }

    room.status = "running";

    room.startTime = new Date();

    await room.save();

    res.json(room);

  } catch {

    res.status(500).json({
      message: "Start failed",
    });
  }
};

// FINISH ROOM + SAVE MATCH HISTORY
const finishRoom = async (
  req,
  res
) => {

  try {

    const room =
      await Room.findOne({
        roomCode:
          req.params.roomCode,
      }).populate(
        "participants",
        "name"
      );

    if (!room) {

      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Only host can finish
    if (
      room.host.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "Only host can finish contest",
      });
    }

    // Prevent duplicate finish
    if (
      room.status === "finished"
    ) {

      return res.status(400).json({
        message:
          "Contest already finished",
      });
    }

    room.status = "finished";

    // =========================
    // BUILD FINAL LEADERBOARD
    // =========================

    const submissions =
      await Submission.find({
        room: room.roomCode,
        status: "Accepted",
      }).populate("user");

    const leaderboard = {};

    submissions.forEach((sub) => {

      const userId =
        sub.user._id.toString();

      if (!leaderboard[userId]) {

        leaderboard[userId] = {
          name: sub.user.name,
          solved: 0,
          executionTimeMs: 0,
          memoryMB: 0,
          timeTakenMs: 0,
          problems: new Set(),
        };
      }

      if (
        !leaderboard[
          userId
        ].problems.has(
          sub.problem.toString()
        )
      ) {

        leaderboard[
          userId
        ].problems.add(
          sub.problem.toString()
        );

        leaderboard[
          userId
        ].solved += 1;

        leaderboard[
          userId
        ].executionTimeMs +=
          sub.executionTimeMs || 0;

        leaderboard[
          userId
        ].memoryMB +=
          sub.memoryMB || 0;

        leaderboard[
          userId
        ].timeTakenMs +=
          sub.timeTakenMs || 0;
      }
    });

    const rankings =
      Object.values(leaderboard)

        .map((user) => ({
          name: user.name,
          solved: user.solved,
          executionTimeMs:
            user.executionTimeMs,
          memoryMB: Number(
            user.memoryMB.toFixed(1)
          ),
          timeTakenMs:
            user.timeTakenMs,
        }))

        .sort((a, b) => {

          if (
            b.solved !== a.solved
          ) {

            return (
              b.solved -
              a.solved
            );
          }

          if (
            a.executionTimeMs !==
            b.executionTimeMs
          ) {

            return (
              a.executionTimeMs -
              b.executionTimeMs
            );
          }

          return (
            a.timeTakenMs -
            b.timeTakenMs
          );
        });

    // WINNER
    const winnerName =
      rankings.length > 0
        ? rankings[0].name
        : "No Winner";

    // =========================
    // SAVE MATCH HISTORY
    // =========================

    await prisma.matchHistory.create({

      data: {

        roomCode: room.roomCode,

        roomName: room.roomName,

        winnerName,

        participantCount:
          room.participants.length,

        rankings,

        // IMPORTANT
        participants:
          room.participants.map(
            (p) => p.name
          ),
      },
    });

    // SAVE ROOM
    await room.save();

    // SOCKET UPDATE
    const io = req.app.get("io");

    io.to(room.roomCode).emit(
      "contestEnded",
      {
        roomCode: room.roomCode,
      }
    );

    res.json({
      message:
        "Contest finished successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to finish contest",
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  startRoom,
  finishRoom,
};