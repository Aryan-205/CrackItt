import { Router } from "express";
import * as tutorialController from "../controllers/tutorial.controller";

const router = Router();

router.get("/", tutorialController.listTutorials);
router.get("/:slug", tutorialController.getTutorial);

export default router;
