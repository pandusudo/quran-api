import nodemailer from "nodemailer";

const isProduction = process.env.NODE_ENV === "production";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: isProduction,
  auth: isProduction
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,
});
