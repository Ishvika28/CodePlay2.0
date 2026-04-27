const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  room: {
    type: String,
    required: true
  },

  problem: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Problem",
  required: true
},

  code: {
    type: String,
    required: true
  },

  language: {
    type: String,
    default: "javascript"
  },

  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer"],
    default: "Wrong Answer"
  },

  timeSubmitted: {
    type: Date,
    default: Date.now
  },

  executionTimeMs: {
    type: Number,
    default: 0
  },

  memoryMB: {
    type: Number,
    default: 0
  },

  timeTakenMs: {
    type: Number,
    default: 0
  }

})

module.exports = mongoose.model("Submission", submissionSchema)