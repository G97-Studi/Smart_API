import { Router } from "express";
import * as DeviceController from "../controllers/deviceController";

const router = Router();

router.get("/", DeviceController.getDevices);
router.post("/", DeviceController.createDevice);
router.put("/:id", DeviceController.updateDevice);
router.delete("/:id", DeviceController.deleteDevice);

export default router;
