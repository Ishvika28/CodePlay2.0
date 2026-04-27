const Submission = require("../models/Submission")

const getLeaderboard = async (req, res) => {

  try {

    const roomCode = req.params.roomCode

    const submissions = await Submission.find({
      room: roomCode,
      status: "Accepted"
    }).populate("user")

    const leaderboard = {}

    // Group by user, and take their best (or first accepted) submission per problem
    submissions.forEach(sub => {
      const userId = sub.user._id

      if (!leaderboard[userId]) {
        leaderboard[userId] = {
          name: sub.user.name,
          solved: 0,
          totalExecutionTime: 0,
          totalMemory: 0,
          totalTimeTaken: 0,
          problems: new Set()
        }
      }

      // Only count each problem once per user
      if (!leaderboard[userId].problems.has(sub.problem.toString())) {
        leaderboard[userId].problems.add(sub.problem.toString())
        leaderboard[userId].solved += 1
        leaderboard[userId].totalExecutionTime += sub.executionTimeMs || 0
        leaderboard[userId].totalMemory += sub.memoryMB || 0
        leaderboard[userId].totalTimeTaken += sub.timeTakenMs || 0
      }
    })

    const result = Object.values(leaderboard).map(u => ({
      name: u.name,
      solved: u.solved,
      executionTimeMs: u.totalExecutionTime,
      memoryMB: u.totalMemory.toFixed(1),
      timeTakenMs: u.totalTimeTaken
    })).sort((a, b) => {
      if (b.solved !== a.solved) return b.solved - a.solved
      if (a.executionTimeMs !== b.executionTimeMs) return a.executionTimeMs - b.executionTimeMs
      if (a.memoryMB !== b.memoryMB) return a.memoryMB - b.memoryMB
      return a.timeTakenMs - b.timeTakenMs
    })

    res.json(result)

  } catch (error) {

    res.status(500).json({
      message: "Leaderboard error"
    })

  }

}

module.exports = { getLeaderboard }