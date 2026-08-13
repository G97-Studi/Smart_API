import express from "express";
import db from "../db";

const router = express.Router();

// GET all repair tickets
router.get("/", (req, res) => {
  db.query("SELECT * FROM repairtickets", (err, results) => {
    if (err) {
      console.error("Tickets database error:", err);

      return res.status(500).json({
        error: "Database error"
      });
    }

    return res.status(200).json(results);
  });
});

export default router;