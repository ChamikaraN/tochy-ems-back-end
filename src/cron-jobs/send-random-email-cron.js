import cron from "node-cron";
import User from "../Models/userModel.js";
import Template from "../Models/templateModel.js";
import Employee from "../Models/employeeModel.js";
import sendEmailUtil from "../utils/sendEmail.js";
import Email from "../Models/emailModel.js";
import {
  incrementEmailSentCount,
  updateNextEmailDate,
} from "../controllers/employeeController.js";

const setupSendRandomEmailCron = () => {
  try {
    // Set up the cron job to run every 5 seconds (adjust as needed)
    cron.schedule("*/5 * * * * *", async () => {
      const usersWithBusinessRole = await User.find({ role: "business" });

      for (const user of usersWithBusinessRole) {
        // Find all templates belonging to the current user
        const templates = await Template.find({ "business.id": user._id });

        // Pick a random template
        const randomIndex = Math.floor(Math.random() * templates.length);
        const randomTemplate = templates[randomIndex];

        // Here, you can use 'randomTemplate' for further processing with this user

        // Find all employees belonging to the current user with nextmaildate < current date
        const currentDate = new Date();
        const employees = await Employee.find({
          "business.id": user._id,
          nextmaildate: { $lt: currentDate },
        });

        for (const employee of employees) {
          const from = `${randomTemplate.emailfrom} <sendit@phishstops.com>`;
          const content = randomTemplate.body;
          const to = employee.email;
          const subject = randomTemplate.subject;

          const mail = await Email.create({
            from: from,
            templateid: randomTemplate._id,
            business: user._id,
            employeeid: employee._id,
            employeename: employee.name,
            envelope: randomTemplate.emailfrom,
            to: employee.email,
            smtpInfo: {
              host: process.env.EMAIL_HOST,
              port: Number(process.env.EMAIL_PORT_NOT_SECURE),
              service: process.env.EMAIL_HOST,
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            },
          });

          if (mail) {
            const verifyUrl = `${process.env.sitelink}#/emailseen?templateid=${mail._id}&emp=${employee._id}`;
            const sendRandomMail = await sendEmailUtil(
              from,
              to,
              subject,
              content.replace("~URL", verifyUrl)
            );
            if (sendRandomMail) {
              updateNextEmailDate(employee._id);
              incrementEmailSentCount(employee._id);
            } else {
              await Email.deleteOne({ _id: mail._id });
            }
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default setupSendRandomEmailCron;
