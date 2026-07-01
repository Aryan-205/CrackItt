import { Router } from "express";
import * as streakController from "../controllers/streak.controller";

const router = Router();

router.get("/:userId", streakController.getStreak);
router.post("/:userId/check-in", streakController.checkIn);

export default router;
