import nodemailer from "nodemailer";
import pug from "pug";
import htmlToText from "html-to-text";
import Mail from "nodemailer/lib/mailer";
import IUser from "../interfaces/user.interfaces/user.interface";
import console from "./console";
import isProductionEnvironment from "./isProductionEnvironment";

export default class Email {
  to?: string;
  firstName?: string;
  url?: string;
  from?: string;

  constructor(user: any, url: String) {
    user = user as IUser;
    this.to = String(user.email);
    this.firstName = user.name.split(" ")[0];
    this.url = String(url);
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  newTransport = () => {
    if (isProductionEnvironment()) {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    console.log(
      String(process.env.EMAIL_HOST),
      process.env.EMAIL_PORT,
      process.env.EMAIL_USERNAME,
      process.env.EMAIL_PASSWORD
    );

    return nodemailer.createTransport({
      host: String(process.env.EMAIL_HOST),
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  };

  // Send the actual email
  async send(template: String, subject: String) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    console.log(html);

    // 2) Define email options
    const mailOptions: Mail.Options = {
      from: this.from,
      to: this.to,
      subject: String(subject),
      html,
      text: htmlToText.fromString(html),
    };

    console.log(mailOptions);

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}
