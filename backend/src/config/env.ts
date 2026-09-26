import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars: string[] = [
  "MONGODB_URI",
  "NODE_ENV",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLIENT_URL",
  "CLERK_SECRET_KEY",
  "CLERK_PUBLISHABLE_KEY",
  "CLERK_WEBHOOK_SECRET",
  "GMAIL_USER",
  "GMAIL_APP_PASSWORD",
  "WHATSAPP_NUMBER",
  "ARCJET_KEY",
  "ADMIN_EMAIL",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

export const ENV = {
  PORT: process.env.PORT || "3000",
  MONGODB_URI: process.env.MONGODB_URI as string,
  NODE_ENV: process.env.NODE_ENV as string,
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    API_KEY: process.env.CLOUDINARY_API_KEY as string,
    API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  },
  CLIENT_URL: process.env.CLIENT_URL as string,
  CLERK: {
    SECRET_KEY: process.env.CLERK_SECRET_KEY as string,
    PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY as string,
    WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET as string,
  },
  GMAIL: {
    USER: process.env.GMAIL_USER as string,
    APP_PASSWORD: process.env.GMAIL_APP_PASSWORD as string,
  },
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER as string,
  ARCJET_KEY: process.env.ARCJET_KEY as string,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
};

export const isDevelopment = ENV.NODE_ENV === "development";
