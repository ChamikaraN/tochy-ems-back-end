import nodemailer from "nodemailer";

export async function sendRandomEmailService(from, to, subject, userId) {
  const verifyUrl = `${process.env.sitelink}#/verifyaccount?user=${userId}`;
  const verificationEmailTemplate = ` hi`;

  const content = verificationEmailTemplate.replace("~URL", verifyUrl);
  sendEmailUtil(from, to, subject, content);
}
