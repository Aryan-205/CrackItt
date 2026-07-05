import { Router } from "express";
import * as completionController from "../controllers/completion.controller";

const router = Router();

router.get("/:userId", completionController.getUserCompletions);
router.post("/:userId/toggle", completionController.toggleUserCompletion);

export default router;
