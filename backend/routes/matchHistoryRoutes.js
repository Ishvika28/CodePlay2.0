const express = require("express");

const router = express.Router();

const {
  getMatchHistory,
  getSingleMatch
} = require(
  "../controllers/matchHistoryController"
);

// ALL MATCHES
router.get("/", getMatchHistory);

// SINGLE MATCH
router.get("/:id", getSingleMatch);

module.exports = router;