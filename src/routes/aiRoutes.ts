import { Router } from "express";
import * as AiController from "../controllers/aiController";

const router = Router();

router.post("/suggest", AiController.suggestIssueDescription);

export default router;
