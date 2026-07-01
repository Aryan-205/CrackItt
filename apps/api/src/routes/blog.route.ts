import { Router } from "express";
import * as blogController from "../controllers/blog.controller";

const router = Router();

router.get("/", blogController.listBlogs);
router.get("/:slug", blogController.getBlog);

export default router;
