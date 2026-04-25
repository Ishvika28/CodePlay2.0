const mongoose = require("mongoose")

const problemSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },

  // ✅ NEW FIELD
  topic: {
    type: String,
    enum: [
      "array",
      "string",
      "math",
      "recursion",
      "dp",
      "graph",
      "greedy"
    ],
    required: true
  },

  sampleTestCases: [
    {
      input: String,
      output: String
    }
  ],

  hiddenTestCases: [
    {
      input: String,
      output: String
    }
  ]

})

module.exports = mongoose.model("Problem", problemSchema)