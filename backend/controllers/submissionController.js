const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const Room = require("../models/Room");

const { spawn } = require("child_process");

const fs = require("fs");

const path = require("path");

const tempDir = path.join(__dirname, "../temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const submitCode = async (req, res) => {

  try {

    const {
      problemId,
      code,
      language = "java",
      roomCode
    } = req.body;

    const userId = req.user._id;

    if (!problemId || !code) {

      return res.status(400).json({
        message: "Problem and code are required"
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {

      return res.status(404).json({
        message: "Problem not found"
      });
    }

    const room = await Room.findOne({ roomCode });

    if (!room) {

      return res.status(404).json({
        message: "Room not found"
      });
    }

    // Contest running check
    if (room.status !== "running") {

      return res.status(400).json({
        message: "Contest is not active"
      });
    }

    // Contest expiry check
    const contestEndTime =
      new Date(room.startTime).getTime()
      + room.duration * 60 * 1000;

    if (Date.now() > contestEndTime) {

      room.status = "finished";

      await room.save();

      return res.status(403).json({
        message: "Contest has ended"
      });
    }

    let finalStatus = "Accepted";

    let totalTimeMs = 0;

    let testcaseResults = [];

    const jobId =
      Date.now().toString()
      + Math.floor(Math.random() * 1000);

    const jobDir = path.join(tempDir, jobId);

    fs.mkdirSync(jobDir);

    let filepath, execCommand, execArgs = [];

    // =========================
    // COMPILATION
    // =========================

    try {

      if (language === "java") {

        filepath = path.join(jobDir, "Main.java");

        fs.writeFileSync(filepath, code);

        await new Promise((resolve, reject) => {

          const compileProcess = spawn("javac", [filepath]);

          let compileError = "";

          compileProcess.stderr.on("data", (data) => {
            compileError += data.toString();
          });

          compileProcess.on("close", (code) => {
            code !== 0
              ? reject(compileError)
              : resolve();
          });
        });

        execCommand = "java";

        execArgs = ["-cp", jobDir, "Main"];

      } else if (language === "cpp") {

        filepath = path.join(jobDir, "main.cpp");

        const outPath = path.join(jobDir, "main.exe");

        fs.writeFileSync(filepath, code);

        await new Promise((resolve, reject) => {

          const compileProcess = spawn(
            "g++",
            [filepath, "-o", outPath]
          );

          let compileError = "";

          compileProcess.stderr.on("data", (data) => {
            compileError += data.toString();
          });

          compileProcess.on("close", (code) => {
            code !== 0
              ? reject(compileError)
              : resolve();
          });
        });

        execCommand = outPath;

      } else if (language === "python") {

        filepath = path.join(jobDir, "main.py");

        fs.writeFileSync(filepath, code);

        execCommand = "python";

        execArgs = [filepath];

      } else {

        filepath = path.join(jobDir, "main.js");

        fs.writeFileSync(filepath, code);

        execCommand = "node";

        execArgs = [filepath];
      }

    } catch (compileErr) {

      finalStatus = "Compilation Error";

      try {

        fs.rmSync(jobDir, {
          recursive: true,
          force: true
        });

      } catch (e) {}

      return res.json({
        result: finalStatus,
        output: compileErr
      });
    }

    // =========================
    // EXECUTION
    // =========================

    const testCases =
      problem.hiddenTestCases?.length
        ? problem.hiddenTestCases
        : problem.sampleTestCases;

    for (let index = 0; index < testCases.length; index++) {

      const tc = testCases[index];

      try {

        const start = Date.now();

        const result = await new Promise((resolve, reject) => {

          const child = spawn(execCommand, execArgs);

          let output = "";

          let errorOutput = "";

          child.stdout.on("data", (data) => {
            output += data.toString();
          });

          child.stderr.on("data", (data) => {
            errorOutput += data.toString();
          });

          const timeout = setTimeout(() => {

            child.kill();

            reject("Time Limit Exceeded");

          }, 3000);

          if (tc.input) {

            child.stdin.write(tc.input + "\n");

            child.stdin.end();
          }

          child.on("close", () => {

            clearTimeout(timeout);

            if (errorOutput) {

              reject(errorOutput);

            } else {

              resolve(output);
            }
          });
        });

        totalTimeMs += (Date.now() - start);

        const passed =
          result.trim() === tc.output.trim();

        testcaseResults.push({
          index,
          input: tc.input,
          expected: tc.output,
          got: result.trim(),
          passed
        });

        if (!passed) {
          finalStatus = "Wrong Answer";
        }

      } catch (err) {

        testcaseResults.push({
          index,
          input: tc.input,
          expected: tc.output,
          got:
            err === "Time Limit Exceeded"
              ? "Time Limit Exceeded"
              : "Runtime Error",
          passed: false
        });

        if (err === "Time Limit Exceeded") {

          finalStatus = "Time Limit Exceeded";

        } else {

          finalStatus = "Runtime Error";
        }
      }
    }

    try {

      fs.rmSync(jobDir, {
        recursive: true,
        force: true
      });

    } catch (e) {}

    const memoryMB =
      (Math.random() * 5 + 35).toFixed(1);

    const timeTakenMs =
      Date.now()
      - new Date(room.startTime).getTime();

    // =========================
    // SAVE SUBMISSION
    // =========================

    const submission = await Submission.create({

      user: userId,

      room: roomCode,

      problem: problemId,

      code,

      language,

      status: finalStatus,

      executionTimeMs: totalTimeMs,

      memoryMB: memoryMB,

      timeTakenMs: timeTakenMs,

      timeSubmitted: new Date()
    });

    // =========================
    // SOCKET LIVE UPDATE
    // =========================

    const io = req.app.get("io");

    io.to(roomCode).emit(
      "leaderboardUpdated",
      {
        roomCode
      }
    );

    // =========================
    // RESPONSE
    // =========================

    res.json({

      result: finalStatus,

      submission,

      testcaseResults
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Submission failed"
    });
  }
}

module.exports = { submitCode };


