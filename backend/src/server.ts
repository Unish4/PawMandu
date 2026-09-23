import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { ENV, isDevelopment } from "./config/env";
import { connectDB } from "./config/db";
import webhookRouter from "./routes/webhook.routes";
import userRouter from "./routes/user.routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import addressRouter from "./routes/address.routes";
import productRouter from "./routes/product.routes";
import categoryRouter from "./routes/category.routes";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);

app.use(morgan(isDevelopment ? "dev" : "combined"));

app.use("/api/webhooks", webhookRouter);

app.use(express.json({ limit: "1mb" }));

app.use(clerkMiddleware());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "PetMandu API",
    version: "1.0.0",
    endpoints: {
      users: {
        me: "GET /api/users/me (protected)",
        adminCheck: "GET /api/users/admin-check (protected, admin only)",
      },
      webhooks: {
        clerk: "POST /api/webhooks/clerk",
      },
    },
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "PetMandu API is running" });
});

app.use("/api/users", userRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async (): Promise<void> => {
  try {
    await connectDB();

    const port = Number(ENV.PORT);

    app.listen(port, () => {
      console.log(`PetMandu API running on http://localhost:${port}`);
      console.log(`Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
