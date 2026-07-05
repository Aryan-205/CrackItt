import { Router } from "express";
import * as blogController from "../controllers/blog.controller";
import * as bookmarkController from "../controllers/bookmark.controller";

const router = Router();

router.get("/", blogController.listBlogs);
router.post("/", blogController.createBlog); // Let's also register createBlog route here!
router.get("/bookmarks/:userId", bookmarkController.getUserBookmarks);
router.post("/:id/bookmark/toggle", bookmarkController.toggleBlogBookmark);
router.get("/:slug", blogController.getBlog);

export default router;
