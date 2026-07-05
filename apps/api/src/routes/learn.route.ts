import { Router } from "express";
import * as learnController from "../controllers/learn.controller";

const router = Router();

router.get("/:category/:slug", learnController.getLearnArticle);

export default router;
