const express = require("express")
const router = express.Router()

const {
  getProblems,
  getProblemById,
  createProblem,
  deleteProblem
} = require("../controllers/problemController")

const protect = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

router.post("/", protect, adminMiddleware, createProblem)

router.get("/", getProblems)
router.get("/:id", getProblemById)
router.delete("/:id", protect, adminMiddleware, deleteProblem);
module.exports = router