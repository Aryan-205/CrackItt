import type { Request, Response } from "express";
import * as tutorialRepo from "../repositories/tutorial.repository";
import { paramString } from "../utils/params";

export async function listTutorials(_req: Request, res: Response) {
  const tutorials = await tutorialRepo.findTutorials();
  res.json(tutorials);
}

export async function getTutorial(req: Request, res: Response) {
  const tutorial = await tutorialRepo.findTutorialBySlug(
    paramString(req.params.slug),
  );
  if (!tutorial) {
    res.status(404).json({ error: "Tutorial not found" });
    return;
  }
  res.json(tutorial);
}
