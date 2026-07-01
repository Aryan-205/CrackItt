import { Router } from "express";
import * as questionController from "../controllers/question.controller";

const router = Router();

router.get("/", questionController.listQuestions);
router.get("/categories", questionController.listCategories);
router.get("/:slug", questionController.getQuestion);

export default router;
