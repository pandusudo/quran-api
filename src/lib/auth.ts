import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { transporter } from "./nodemailer";
import {
  getChangeEmailVerificationEmail,
  getVerificationEmail,
} from "../helpers/email";
import { fromNodeHeaders } from "better-auth/node";

export const auth = betterAuth({
  baseUrl: "http://localhost:3001",
  session: {
    expiresIn: 3600 * 24 * 7,
    updateAge: 3600 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 300,
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ url, user, newEmail }) => {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email!,
          subject: "Update email verification",
          html: getChangeEmailVerificationEmail(
            url,
            "api/redirect-change-email",
            newEmail
          ),
        });
      },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 3600,
    sendVerificationEmail: async ({ user, url }) => {
      const callbackUrl = "api/redirect";
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email!,
        subject: "Verify your email",
        html: getVerificationEmail(url, callbackUrl),
      });
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  advanced: {
    useSecureCookies: false,
    cookiePrefix: "dev-app",
    cookies: {
      session_token: {
        name: "dev_session_token",
        attributes: {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        },
      },
    },
  },
});

export const checkSession = async (headers: any) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(headers),
  });

  return session;
};
