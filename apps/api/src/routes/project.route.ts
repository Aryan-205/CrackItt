import { Router } from "express";
import * as projectController from "../controllers/project.controller";

const router = Router();

router.get("/", projectController.listProjects);
router.post("/", projectController.create);
router.get("/categories", projectController.projectCategory);
router.get("/:slug", projectController.getProject);
router.post("/:id/vote", projectController.vote);
router.post("/:id/rate", projectController.rate);

export default router;
