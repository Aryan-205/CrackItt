import type { Request, Response } from "express";
import * as completionRepo from "../repositories/completion.repository";
import { paramString } from "../utils/params";

export async function getUserCompletions(req: Request, res: Response) {
  const userId = paramString(req.params.userId);
  const completions = await completionRepo.findUserCompletions(userId);
  res.json(completions);
}

export async function toggleUserCompletion(req: Request, res: Response) {
  const userId = paramString(req.params.userId);
  const { itemId, itemType } = req.body;

  const result = await completionRepo.toggleCompletion(userId, itemId, itemType);
  res.json(result);
}
