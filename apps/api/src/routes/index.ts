import express from "express";
import cors from "cors";
import questionRoutes from "./question.route";
import blogRoutes from "./blog.route";
import tutorialRoutes from "./tutorial.route";
import streakRoutes from "./streak.route";
import dashboardRoutes from "./dashboard.route";
import projectRoutes from "./project.route";
import codingQuestionRoutes from "./coding-question.route";
import learnRoutes from "./learn.route";
import completionRoutes from "./completion.route";
import communityQuestionRoutes from "./community-question.route";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/questions", questionRoutes);
app.use("/blogs", blogRoutes);
app.use("/tutorials", tutorialRoutes);
app.use("/streaks", streakRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/projects", projectRoutes);
app.use("/coding-questions", codingQuestionRoutes);
app.use("/learn", learnRoutes);
app.use("/completions", completionRoutes);
app.use("/community/forum", communityQuestionRoutes);

export default app;
