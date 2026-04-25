const Problem = require("../models/Problem")

const selectProblems = async (difficulty, topic, count) => {

  let query = {}

  if (difficulty !== "any") query.difficulty = difficulty.toLowerCase()
  if (topic !== "any") query.topic = topic.toLowerCase()

  const problems = await Problem.aggregate([
    { $match: query },
    { $sample: { size: count } }
  ])

  if (problems.length < count) {
    throw new Error("Not enough problems available")
  }

  return problems
}

module.exports = selectProblems