import type { Request, Response } from "express";
import * as bookmarkRepo from "../repositories/bookmark.repository";
import { paramString } from "../utils/params";

export async function getUserBookmarks(req: Request, res: Response) {
  const userId = paramString(req.params.userId);
  const bookmarks = await bookmarkRepo.findUserBookmarks(userId);
  res.json(bookmarks);
}

export async function toggleBlogBookmark(req: Request, res: Response) {
  const blogId = paramString(req.params.id);
  const { userId } = req.body;

  const result = await bookmarkRepo.toggleBookmark(userId || "demo-user", blogId);
  res.json(result);
}
