import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { functions, inngest } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoute.js";
import sessionRoutes from "./routes/sessionRoute.js";
import resumeRoutes from "./routes/resumeRoute.js";


const app = express();
const __dirname = path.resolve();

//middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); //this addss auth field to request object
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

app.use("/api/sessions", sessionRoutes);
app.use("/api/resume", resumeRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
})

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer();
