import nodemailer from "nodemailer";
import { ENV } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: ENV.GMAIL.USER,
    pass: ENV.GMAIL.APP_PASSWORD, 
  },
});

export const EMAIL_FROM = `"PawMandu" <${ENV.GMAIL.USER}>`;
