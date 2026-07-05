import type { Request, Response } from "express";
import * as learnRepo from "../repositories/learn.repository";
import { paramString } from "../utils/params";

export async function getLearnArticle(req: Request, res: Response) {
  const category = paramString(req.params.category);
  const slug = paramString(req.params.slug);

  const article = await learnRepo.findLearnArticle(category, slug);
  if (!article) {
    res.status(404).json({ error: "Learn article not found" });
    return;
  }
  res.json(article);
}
