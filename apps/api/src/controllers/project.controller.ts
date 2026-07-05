import type { Request, Response } from "express";
import * as projectRepo from "../repositories/project.repository";
import { paramString } from "../utils/params";

const DEMO_USER_ID = "demo-user";

export async function listProjects(req: Request, res: Response) {
  const userId = (req.query.userId as string) || DEMO_USER_ID;
  const list = await projectRepo.findProjects(userId);
  res.json(list);
}

export async function projectCategory(_req: Request, res: Response) {
  const tags = await projectRepo.findUniqueProjectTags();
  res.json(tags);
}

export async function getProject(req: Request, res: Response) {
  const userId = (req.query.userId as string) || DEMO_USER_ID;
  const projectId = paramString(req.params.slug);
  const proj = await projectRepo.findProjectById(projectId, userId);
  if (!proj) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(proj);
}

export async function create(req: Request, res: Response) {
  const { title, description, author, repoUrl, demoUrl, tags } = req.body;
  const id = `cp-user-${Date.now()}`;
  await projectRepo.createProject({
    id,
    title,
    description,
    author: author || "You",
    repoUrl,
    demoUrl,
    tags: Array.isArray(tags) ? tags : [],
  });

  const created = await projectRepo.findProjectById(id, DEMO_USER_ID);
  res.json(created);
}

export async function vote(req: Request, res: Response) {
  const userId = DEMO_USER_ID;
  const projectId = paramString(req.params.id);
  const { direction } = req.body; // "up", "down", or null

  await projectRepo.voteProject(projectId, userId, direction);
  const updated = await projectRepo.findProjectById(projectId, userId);
  res.json(updated);
}

export async function rate(req: Request, res: Response) {
  const userId = DEMO_USER_ID;
  const projectId = paramString(req.params.id);
  const { rating } = req.body; // number 1-5

  await projectRepo.rateProject(projectId, userId, Number(rating));
  const updated = await projectRepo.findProjectById(projectId, userId);
  res.json(updated);
}
