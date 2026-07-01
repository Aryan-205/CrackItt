import express from "express";
import cors from "cors";
import questionRoutes from "./question.route";
import blogRoutes from "./blog.route";
import tutorialRoutes from "./tutorial.route";
import streakRoutes from "./streak.route";
import dashboardRoutes from "./dashboard.route";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
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

export default app;
