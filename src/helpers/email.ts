import fs from "fs";
import path from "path";

export function getVerificationEmail(url: string, callbackUrl: string): string {
  const filePath = path.join(__dirname, "../emails/verification.html");
  let template = fs.readFileSync(filePath, "utf-8");

  template = template
    .replace(/\$\{url\}/g, url)
    .replace(/\$\{callbackUrl\}/g, callbackUrl);

  return template;
}

export function getChangeEmailVerificationEmail(
  url: string,
  callbackUrl: string,
  newEmail: string
): string {
  const filePath = path.join(
    __dirname,
    "../emails/change-email-verification.html"
  );
  let template = fs.readFileSync(filePath, "utf-8");

  template = template
    .replace(/\$\{url\}/g, url)
    .replace(/\$\{callbackUrl\}/g, callbackUrl)
    .replace(/\$\{newEmail\}/g, newEmail);

  return template;
}
