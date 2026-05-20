const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddleware")

const {
  createRoom,
  joinRoom,
  getRoom,
  startRoom,
  finishRoom
} = require("../controllers/roomController")

router.post("/create", protect, createRoom)
router.post("/join", protect, joinRoom)
router.get("/:roomCode", protect, getRoom)
router.post("/:roomCode/start", protect, startRoom)
router.post("/:roomCode/finish", protect, finishRoom)

module.exports = router   