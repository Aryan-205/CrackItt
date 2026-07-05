import type { Request, Response } from "express";
import * as communityRepo from "../repositories/community-question.repository";
import { paramString } from "../utils/params";

const DEMO_USER_ID = "demo-user";

export async function listQuestions(req: Request, res: Response) {
  const userId = (req.query.userId as string) || DEMO_USER_ID;
  const list = await communityRepo.findCommunityQuestions(userId);
  res.json(list);
}

export async function createQuestion(req: Request, res: Response) {
  const { title, body, author, tags } = req.body;
  const id = `cq-user-${Date.now()}`;
  await communityRepo.createCommunityQuestion({
    id,
    title,
    body,
    author: author || "You",
    tags: Array.isArray(tags) ? tags : [],
  });

  const created = await communityRepo.findCommunityQuestionById(id, DEMO_USER_ID);
  res.json(created);
}

export async function submitAnswer(req: Request, res: Response) {
  const questionId = paramString(req.params.id);
  const { author, content } = req.body;
  const id = `ca-user-${Date.now()}`;

  await communityRepo.createCommunityAnswer({
    id,
    questionId,
    author: author || "You",
    content,
  });

  const updated = await communityRepo.findCommunityQuestionById(questionId, DEMO_USER_ID);
  res.json(updated);
}

export async function voteQuestion(req: Request, res: Response) {
  const questionId = paramString(req.params.id);
  const { direction, userId } = req.body;
  const uId = userId || DEMO_USER_ID;

  await communityRepo.voteCommunityQuestion(questionId, uId, direction);
  const updated = await communityRepo.findCommunityQuestionById(questionId, uId);
  res.json(updated);
}
