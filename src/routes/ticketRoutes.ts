import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();
// GET all repair tickets
router.get("/", async (_req: Request, res: Response) => {
 try {
 const [rows] = await pool.query(`
            SELECT 
                t.*,
                c.full_name as customer_name,
                c.email as customer_email,
                d.device_type,
                d.brand,
                d.model
            FROM RepairTickets t
            LEFT JOIN Customers c 
            ON t.customer_id = c.customer_id
            LEFT JOIN Devices d 
            ON t.device_id = d.device_id
        `);  res.json(rows);
 } catch(error:any){
  console.error("Error fetching tickets:", error);
        res.status(500).json({
            message:"Failed to retrieve tickets",
            error:error.message        });

    }
});
// POST create a new repair ticket
router.post("/", async (req: Request, res: Response)=>{
try {
 const {  customer_id,
            device_id,
            issue_description,
            status
        } = req.body;

 const [result]: any = await pool.query(
            `INSERT INTO RepairTickets
            (customer_id, device_id, issue_description, status)
            VALUES (?, ?, ?, ?)`,
            [
                customer_id,
                device_id,
                issue_description,
                status
            ]
        );
  res.status(201).json({
message:"Ticket created successfully",
ticket_id: result.insertId
});
} catch(error:any){
 console.error("Error creating ticket:", error);
res.status(500).json({
        message:"Failed to create ticket",
        error:error.message
    });
 }
});
// PUT update ticket by ID
router.put("/:id", async(req: Request,res: Response)=>{
try {
const {id} = req.params;
const {
            customer_id,
            device_id,
            issue_description,
            status
        } = req.body;
      const [result]:any = await pool.query(
            `UPDATE RepairTickets
            SET 
            customer_id=?,
            device_id=?,
            issue_description=?,
            status=?
            WHERE ticket_id=?`,
[
customer_id, 
device_id,
issue_description,
status,
id
] );
 if(result.affectedRows === 0){
return res.status(404).json({
 message:"Ticket not found"
 }); }
res.status(200).json({
message:"Ticket updated successfully"
});
   }catch(error:any){
console.error("Error updating ticket:",error);


        res.status(500).json({

         message:"Failed to update ticket",

         error:error.message

     });

 }

});

// DELETE ticket by ID
router.delete("/:id", async(req: Request,res: Response)=>{

 try{
const {id}=req.params;
const [result]:any = await pool.query(
`
DELETE FROM RepairTickets
WHERE ticket_id=?`,
[id]

    );


if(result.affectedRows === 0){
 return res.status(404).json({
 message:"Ticket not found"
});
 }



 res.status(200).json({
 message:"Ticket deleted successfully"
});


}catch(error:any){

 console.error("Error deleting ticket:",error);
res.status(500).json({
  message:"Failed to delete ticket",
   error:error.message
});
 }

});



export default router;