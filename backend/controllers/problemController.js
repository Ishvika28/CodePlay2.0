const Problem = require("../models/Problem");

const allowedTopics = [
  "array",
  "string",
  "math",
  "recursion",
  "dp",
  "graph",
  "greedy"
];

const allowedDifficulties = ["easy", "medium", "hard"];

const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("-hiddenTestCases");
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProblem = async (req, res) => {
  try {
    let {
      title,
      description,
      difficulty,
      topic,
      sampleTestCases,
      hiddenTestCases
    } = req.body;

    difficulty = difficulty.toLowerCase();
    topic = topic.toLowerCase();

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    if (!allowedTopics.includes(topic)) {
      return res.status(400).json({ message: "Invalid topic" });
    }

    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty" });
    }

    if (
      !sampleTestCases.length ||
      !hiddenTestCases.length
    ) {
      return res.status(400).json({ message: "Test cases required" });
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      topic,
      sampleTestCases,
      hiddenTestCases
    });

    res.status(201).json(problem);

  } catch (error) {
    res.status(500).json({ message: "Failed to create problem" });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select("-hiddenTestCases");

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);

  } catch {
    res.status(500).json({ message: "Error fetching problem" });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    await problem.deleteOne();

    res.json({ message: "Problem deleted successfully" });

  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  deleteProblem
};