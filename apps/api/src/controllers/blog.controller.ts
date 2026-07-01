import type { Request, Response } from "express";
import * as blogRepo from "../repositories/blog.repository";
import { paramString } from "../utils/params";

export async function listBlogs(_req: Request, res: Response) {
  const posts = await blogRepo.findBlogPosts();
  res.json(posts);
}

export async function getBlog(req: Request, res: Response) {
  const post = await blogRepo.findBlogBySlug(paramString(req.params.slug));
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(post);
}
