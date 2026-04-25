const Problem = require("../models/Problem")

// get all problems (SAFE)
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("-hiddenTestCases")
    res.json(problems)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// create problem
const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    topic,
    sampleTestCases,
    hiddenTestCases
  } = req.body

  try {
    const problem = await Problem.create({
      title,
      description,
      difficulty: difficulty.toLowerCase(),
      topic: topic.toLowerCase(),
      sampleTestCases,
      hiddenTestCases
})

    res.status(201).json(problem)
  } catch {
    res.status(500).json({ message: "Failed to create problem" })
  }
}

// get single problem (SAFE)
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select("-hiddenTestCases")

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    res.json(problem)
  } catch {
    res.status(500).json({ message: "Error fetching problem" })
  }
}

const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    await problem.deleteOne()
    res.json({ message: "Problem deleted successfully" })

  } catch {
    res.status(500).json({ message: "Delete failed" })
  }
}

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  deleteProblem
}