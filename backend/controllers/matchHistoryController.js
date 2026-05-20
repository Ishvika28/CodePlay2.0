const prisma = require("../prisma/prismaClient");

// GET ALL MATCH HISTORY
const getMatchHistory = async (req, res) => {

  try {

    const matches =
      await prisma.matchHistory.findMany({

        orderBy: {
          createdAt: "desc"
        }

      });

    res.json(matches);

  } catch (error) {

    console.error("MATCH HISTORY ERROR:");
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch match history"
    });
  }
};

// GET SINGLE MATCH
const getSingleMatch = async (req, res) => {

  try {

    const match =
      await prisma.matchHistory.findUnique({

        where: {
          id: Number(req.params.id)
        }

      });

    if (!match) {

      return res.status(404).json({
        message: "Match not found"
      });
    }

    res.json(match);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch match"
    });
  }
};

module.exports = {
  getMatchHistory,
  getSingleMatch
};