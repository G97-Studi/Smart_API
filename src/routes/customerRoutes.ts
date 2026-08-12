import { Router } from "express";
import * as CustomerController from "../controllers/customerController";

const router = Router();

router.get("/", CustomerController.getCustomers);
router.post("/", CustomerController.createCustomer);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
