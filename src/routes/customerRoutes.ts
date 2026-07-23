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

  //POST
 router.post("/", (req, res) => {
  const { full_name, email, phone, address } = req.body;

  const sql =
    "INSERT INTO customers (full_name, email, phone, address) VALUES (?, ?, ?, ?)";

  db.query(sql, [full_name, email, phone, address], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.status(201).json({ message: "Customer created successfully" });
  });

  //PUT
  router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { full_name, email, phone, address } = req.body;

  const sql =
    "UPDATE customers SET full_name=?, email=?, phone=?, address=? WHERE customer_id=?";

  db.query(sql, [full_name, email, phone, address, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.json({ message: "Customer updated successfully" });
  });

   //DELETE
   router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM customers WHERE customer_id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.json({ message: "Customer deleted successfully" });
  });
  
});
});
});
});

export default router;