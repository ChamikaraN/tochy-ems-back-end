import {
  getEmployeeList,
  incrementEmailSentCount,
} from "../../controllers/employeeController.js";
import { getAllBusinessList } from "../../controllers/userController.js";
import nodemailer from "nodemailer";
import cron from "node-cron";
import {
  addEmailHistoryToDatabase,
  getTemplateDetails,
} from "../../controllers/productController.js";
import Email from "../../Models/emailModel.js";
import Template from "../../Models/templateModel.js";

const randomTemplate = (tmp) => {
  return Math.floor(Math.random() * tmp.length);
};
const randomDate = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

async function sendEmail(
  { from, to, subject, html },
  efrom,
  templateid,
  businessid,
  employeeid,
  employeename,
  task
) {
  const transporter = await nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    tls: { rejectUnauthorized: false },
    //requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const envelope = {
    from: process.env.ENVELOPE_FROM,
    //to: process.env.ENVELOPE_TO
  };
  let link = ` <p>This email received by - ${to}</p> </br>
    <p>Email Tracker: <a href='${process.env.sitelink}#/emailseen?templateid=${templateid}&emp=${employeeid}'>Click Here </a> </p>`;
  let htmlWithLink = link + html;
  await transporter.sendMail(
    { from, to, envelope, subject, html: htmlWithLink },
    async (error, info) => {
      if (error) {
        console.log("Email error application", error.message);
      } else {
        incrementEmailSentCount(employeeid);
        addEmailHistoryToDatabase(
          efrom,
          templateid,
          businessid,
          employeeid,
          employeename
        ).then(async (res) => {
          if (res) {
            console.log("Email sent succcessfully!");
            await Email.create({
              from: efrom,
              templateid,
              businessid,
              employeeid,
              employeename,
              to,
              smtoInfo: {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                service: "smtp.gmail.com",
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS,
                },
              },
              envelope: {
                from: process.env.ENVELOPE_FROM,
              },
            });
            task.stop();
          }
        });
      }
    }
  );
}

const sendMailRandomDate = (
  { from, to, subject, html },
  efrom,
  templateid,
  businessid,
  employeeid,
  employeename,
  randDate
) => {
  //const task= cron.schedule(`0 0 ${randDate} * *`, () => {
  const task = cron.schedule(`${randDate} * * * *`, async () => {
    // random date in a month

    // console.log('Cron Task - READ - Time: ' + (new Date()));
    sendEmail(
      { from, to, subject, html },
      efrom,
      templateid,
      businessid,
      employeeid,
      employeename,
      task
    );
    await Email.create({
      from,
      templateid,
      employeename,
      employeeid,
      to,
      businessid,
      smtoInfo: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        service: "mail.phishstops.com",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      envelope: {
        from: process.env.ENVELOPE_FROM,
      },
    });
  });
  task.start();
};

export const emailFunc = () => {
  getAllBusinessList().then((res) => {
    // console.log(res)
    res.forEach(async (single) => {
      // console.log(single);

      const randomTemplateId = await randomTemplate(single.selectedTemplate);
      // console.log(randomTemplateId);

      // return
      const randomTemplateDetails = single.selectedTemplate[randomTemplateId];

      if (randomTemplateDetails) {
        // console.log(randomTemplateDetails.templateid);
        getTemplateDetails(randomTemplateDetails.templateid).then(
          (template) => {
            const body = template[0].body;
            const from = template[0].emailfrom;
            const subject = template[0].subject;
            getEmployeeList(single._id).then((emp) => {
              // console.log(emp)
              emp.forEach(async (singleemp) => {
                //   console.log(singleemp);
                const to = singleemp.email;
                const employeeId = singleemp._id;
                const employeename = singleemp.name;

                //sendMailRandomDate({from, to, subject,html:body}, from, randomTemplateDetails.templateid, single._id, employeeId, employeename, randomDate(1,30) )
                sendMailRandomDate(
                  { from, to, subject, html: body },
                  from,
                  randomTemplateDetails.templateid,
                  single._id,
                  employeeId,
                  employeename,
                  randomDate(36,41)
                );
              });
            });
          }
        );
      }
    });
    return true;
  });
};

export async function emailVerification(to, userid, business, name) {
  let from = process.env.EMAIL_USER;
  let subject = "Account verification";
  let html = "";
  const transporter = await nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    tls: { rejectUnauthorized: false },
    //requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  //let link= ` <h3>Please verify your account</h3> </br>
  //<p> <a href='${process.env.sitelink}#/verifyaccount?user=${userid}'>Click Here </a> </p>`
  let link = `<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#1074BB" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#1074BB" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Let's start together!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 3px;" bgcolor="#1074BB"><a href='${process.env.sitelink}#/verifyaccount?user=${userid}' target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #1074BB; display: inline-block;">Confirm Account</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr> <!-- COPY -->
                    <tr>
                        
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">If you have any questions, just reply to this email support@phishstops.com, we're always happy to help out.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Cheers,<br>Phishstops Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                            <p style="margin: 0;"><a href="https://www.phishstops.com/contact/" target="_blank" style="color: #1074BB;">We&rsquo;re here to help you out</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                            <p style="margin: 0;">If these emails get annoying, please feel free to unsubscribe sending an email to support@phishstops.com</a>.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`;

  let htmlWithLink = link + html;
  await transporter.sendMail(
    { from, to, subject, html: htmlWithLink },
    async (error, info) => {
      if (error) {
        console.log("Email error application", error.message);
      } else {
        console.log("email sent");
        const template = await Template.create({
          title: "Verification Email",
          emailfrom: from,
          subject,
          body: htmlWithLink,
        });
        const email = await Email.create({
          smtoInfo: {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            service: "mail.phishstops.com",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          },
          envelope: {
            from: process.env.ENVELOPE_FROM,
          },
          to,
          from,
          templateid: template._id,
          business: business,
          employeename: name,
          employeeid: userid,
        });
        template.business.push(email._id);
        await template.save();
      }
    }
  );
}
