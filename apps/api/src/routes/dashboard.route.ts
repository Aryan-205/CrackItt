import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";

const router = Router();

router.get("/feed", dashboardController.getFeed);
router.get("/users/:userId", dashboardController.getUser);

export default router;
