import type { Request, Response } from "express";
import * as streakRepo from "../repositories/streak.repository";
import { paramString } from "../utils/params";

export async function getStreak(req: Request, res: Response) {
  const streak = await streakRepo.findStreak(paramString(req.params.userId));
  res.json(streak);
}

export async function checkIn(req: Request, res: Response) {
  const streak = await streakRepo.checkIn(paramString(req.params.userId));
  res.json(streak);
}
