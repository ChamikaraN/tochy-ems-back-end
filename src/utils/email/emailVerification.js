import nodemailer from "nodemailer";

export async function sendVerificationEmail() {
  let to = "dev.chamikara@gmail.com";
  let from = "sendit@phishstops.com";
  let subject = "Account verification";
  let html = "hi";
  const transporter = nodemailer.createTransport({
    host: "mail.phishstops.com",
    port: 587, //587 , 465
    secure: false, // Use secure connection
    auth: {
      user: "sendit@phishstops.com",
      pass: "Dwck6rS7BgU0fc8iifrQ",
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
      html,
    });
    console.log("Email sent");
  } catch (error) {
    console.error("Email error:", error.message);
  }
}
