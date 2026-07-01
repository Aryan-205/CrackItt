import type { Request, Response } from "express";
import * as dashboardRepo from "../repositories/dashboard.repository";
import { paramString } from "../utils/params";

export async function getFeed(_req: Request, res: Response) {
  const feed = await dashboardRepo.getDashboardFeed();
  res.json(feed);
}

export async function getUser(req: Request, res: Response) {
  const user = await dashboardRepo.findUserById(paramString(req.params.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
}
