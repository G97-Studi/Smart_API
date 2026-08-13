import { Router } from "express";
import * as TicketController from "../controllers/ticketController";

const router = Router();

router.get("/", TicketController.getTickets);
router.post("/", TicketController.createTicket);
router.put("/:id", TicketController.updateTicket);
router.delete("/:id", TicketController.deleteTicket);

export default router;
