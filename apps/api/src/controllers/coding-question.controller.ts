import type { Request, Response } from "express";
import * as codingRepo from "../repositories/coding-question.repository";
import { paramString } from "../utils/params";

export async function listCodingQuestions(_req: Request, res: Response) {
  const list = await codingRepo.findCodingQuestions();
  res.json(list);
}

export async function getCodingQuestion(req: Request, res: Response) {
  const slug = paramString(req.params.slug);
  const question = await codingRepo.findCodingQuestionBySlug(slug);
  if (!question) {
    res.status(404).json({ error: "Coding question not found" });
    return;
  }
  res.json(question);
}
