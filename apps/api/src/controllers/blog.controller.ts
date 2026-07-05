import type { Request, Response } from "express";
import * as blogRepo from "../repositories/blog.repository";
import { paramString } from "../utils/params";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

export async function createBlog(req: Request, res: Response) {
  const { title, content, tag, excerpt, author } = req.body;
  const id = `blog-user-${Date.now()}`;
  const slug = `${slugify(title || "untitled")}-${Date.now().toString().slice(-4)}`;

  await blogRepo.createBlogPost({
    id,
    title: title || "Untitled Post",
    slug,
    excerpt: excerpt || (content ? content.slice(0, 120) + "..." : "No excerpt provided."),
    content: content || "",
    author: author || "Aryan",
    tag: tag || "Community",
  });

  const created = await blogRepo.findBlogBySlug(slug);
  res.json(created);
}
