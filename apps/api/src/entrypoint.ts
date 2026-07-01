import "dotenv/config";
import app from "./routes";

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
