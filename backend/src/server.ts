import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { ENV, isDevelopment } from "./config/env.js";
import { connectDB } from "./config/db.js";
import webhookRouter from "./routes/webhook.routes.js";
import userRouter from "./routes/user.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { arcjetProtect } from "./middleware/arcjetProtect.js";
import { generalLimiter, webhookLimiter } from "./middleware/rateLimiter.js";
import addressRouter from "./routes/address.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminOrderRouter from "./routes/adminOrder.routes.js";
import adminProductRouter from "./routes/adminProduct.routes.js";
import adminDashboardRouter from "./routes/adminDashboard.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import { transporter } from "./config/email.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);

app.use(morgan(isDevelopment ? "dev" : "combined"));

app.use("/api/webhooks", webhookLimiter, webhookRouter);

app.use(express.json({ limit: "1mb" }));

app.use(clerkMiddleware());

app.use(arcjetProtect);
app.use(generalLimiter);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "PawMandu API",
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
  res.status(200).json({ success: true, message: "PawMandu API is running" });
});

app.use("/api/users", userRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/dashboard", adminDashboardRouter);
app.use("/api/admin/uploads", uploadRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async (): Promise<void> => {
  try {
    await connectDB();

    transporter
      .verify()
      .then(() => console.log("Email transporter ready"))
      .catch((err) =>
        console.warn(
          "Email transporter verification failed — order emails will not send:",
          err.message,
        ),
      );

    const port = Number(ENV.PORT);

    app.listen(port, () => {
      console.log(`PawMandu API running on http://localhost:${port}`);
      console.log(`Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
