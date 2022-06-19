import nodeMailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import logger from "./logger.service";


let transporter: nodeMailer.Transporter;

const transport: SMTPTransport.Options = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "user",
    pass: "password",
  },
};

// const exampleMessage: nodeMailer.SendMailOptions = {
//   from: "test@test.fr",
//   to: "test@test.fr",
//   subject: "Test",
//   html: "<p><b>Test</b></p>",
//   attachments: undefined,
// };

export async function initialize() {
  try {
    transporter = await nodeMailer.createTransport(transport);
  } catch (error) {
    logger.error("Problem during initialization of nodeMailer", {error: error});
  }
}

export async function sendMail(message: nodeMailer.SendMailOptions) {
  try {
    await transporter.sendMail(message);
  } catch (error) {
    logger.error("Error while sending mail", {error: error});
  }
}
