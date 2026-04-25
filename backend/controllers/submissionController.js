const Submission = require("../models/Submission")
const Problem = require("../models/Problem")

const submitCode = async (req, res) => {
  try {
    const { problemId, code } = req.body
    const userId = req.user._id

    if (!problemId || !code) {
      return res.status(400).json({
        message: "Problem and code are required"
      })
    }

    const problem = await Problem.findById(problemId)

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    let finalStatus = "Accepted"

    for (let tc of problem.hiddenTestCases) {

      const response = await fetch(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            source_code: code,
            language_id: 54, // C++
            stdin: tc.input
          })
        }
      )

      const result = await response.json()

if (result.stderr) {
  finalStatus = "Compilation Error"
  break
}

if (!result.stdout) {
  finalStatus = "Runtime Error"
  break
}

const output = result.stdout.trim()

      if (output !== tc.output.trim()) {
        finalStatus = "Wrong Answer"
        break
      }
    }

    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code,
      language: "cpp",
      status: finalStatus,
      timeSubmitted: new Date()
    })

    res.json({
      result: finalStatus,
      submission
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Submission failed"
    })
  }
}

module.exports = { submitCode }