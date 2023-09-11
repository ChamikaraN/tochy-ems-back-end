import { verificationEmailTemplate } from "./verificationEmailTemplate.js";
import sendEmailUtil from "../utils/sendEmail.js";

export default async function sendVerificationEmailService(
  from,
  to,
  subject,
  userId
) {
  const verifyUrl = `${process.env.sitelink}#/verifyaccount?user=${userId}`;
  const content = verificationEmailTemplate.replace("~URL", verifyUrl);
  sendEmailUtil(from, to, subject, content);
}
