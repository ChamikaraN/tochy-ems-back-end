import cron from "node-cron";
import User from "../Models/userModel.js";
import { getTotalMailStatsByBusiness } from "../controllers/employeeController.js";
import sendEmailUtil from "../utils/sendEmail.js";

const sendMonthlyStatusCron = async () => {
  try {
    // Set up the cron job to run every 5 seconds (adjust as needed)
    cron.schedule("0 0 1 * * *", async () => {
      const usersWithBusinessRole = await User.find({ role: "business" });

      for (const user of usersWithBusinessRole) {
        const { totalMailsSent, totalMailsOpened } =
          await getTotalMailStatsByBusiness(user._id);

        const content = `<!DOCTYPE html>
        <html>
        <head>
            <title>Email Template</title>
        </head>
        <body>
            <h1>Email Statistics</h1>
            <p>Total Mails Sent: ${totalMailsSent}</p>
            <p>Total Mails Opened: ${totalMailsOpened}</p>
            <p>Total Mails to be Opened: ${
              totalMailsSent - totalMailsOpened
            }</p>
        </body>
        </html>`;

        const from = "Phishstops <sendit@phishstops.com>";
        const to = user.email;
        const subject = "Monthly Email Status";

        await sendEmailUtil(from, to, subject, content);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendMonthlyStatusCron;
