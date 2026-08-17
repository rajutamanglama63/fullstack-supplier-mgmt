import "dotenv/config";
import { createApp } from "./app.js";
import { connectDb } from "./db.js";

const port = Number(process.env.PORT) || 3001;

async function start(): Promise<void> {
  await connectDb();

  const app = createApp();
  app.listen(port, () => {
    console.log(`Supplier API running on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
