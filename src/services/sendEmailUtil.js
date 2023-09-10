import nodemailer from "nodemailer";

const sendEmailUtil = async (from, to, subject, content) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // Use the correct environment variable
    secure: false, // Use secure connection
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      content,
    });
    console.log("Email sent");
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

export default sendEmailUtil;
