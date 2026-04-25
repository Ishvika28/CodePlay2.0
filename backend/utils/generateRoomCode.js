const Room = require("../models/Room")

const generateRoomCode = async () => {
  let code
  let exists = true

  while (exists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const room = await Room.findOne({ roomCode: code })
    if (!room) exists = false
  }

  return code
}

module.exports = generateRoomCode   