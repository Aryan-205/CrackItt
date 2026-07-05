import { Router } from "express";
import * as communityController from "../controllers/community-question.controller";

const router = Router();

router.get("/", communityController.listQuestions);
router.post("/", communityController.createQuestion);
router.post("/:id/vote", communityController.voteQuestion);
router.post("/:id/answers", communityController.submitAnswer);

export default router;
