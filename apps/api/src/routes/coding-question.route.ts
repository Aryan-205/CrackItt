import { Router } from "express";
import * as codingController from "../controllers/coding-question.controller";

const router = Router();

router.get("/", codingController.listCodingQuestions);
router.get("/:slug", codingController.getCodingQuestion);

export default router;
