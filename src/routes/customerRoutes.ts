import express from "express";
import db from "../db";

const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.json(results);
  });
});

export default router;