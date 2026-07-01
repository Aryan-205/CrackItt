import type { Request, Response } from "express";
import * as questionRepo from "../repositories/question.repository";
import { paramString } from "../utils/params";

export async function listQuestions(req: Request, res: Response) {
  const category = req.query.category as string | undefined;
  const questions = await questionRepo.findQuestions(category);
  res.json(questions);
}

export async function getQuestion(req: Request, res: Response) {
  const question = await questionRepo.findQuestionBySlug(
    paramString(req.params.slug),
  );
  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }
  res.json(question);
}

export async function listCategories(_req: Request, res: Response) {
  const categories = await questionRepo.findCategories();
  res.json(categories);
}
