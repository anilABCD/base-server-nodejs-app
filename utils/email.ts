import nodemailer from "nodemailer";
import pug from "pug";
import htmlToText from "html-to-text";
import Mail from "nodemailer/lib/mailer";
import IUser from "../interfaces/user.interfaces/user.interface";
import console from "./console";
import isProductionEnvironment from "./isProductionEnvironment";

import getEnv, { EnvEnumType } from "../env/getEnv";

export default class Email {
  to?: string;
  firstName?: string;
  url?: string;
  from?: string;

  constructor(user: any, url: String) {
    user = user as IUser;
    this.to = String(`${user.name} <${user.email}>`);
    this.firstName = user.name.split(" ")[0];
    this.url = String(url);
    this.from = `${getEnv(EnvEnumType.EMAIL_FROM_FULL_NAME)} <${getEnv(
      EnvEnumType.EMAIL_FROM
    )}>`;
  }

  newTransport = () => {
    if (isProductionEnvironment()) {
      // Sendgrid
      return nodemailer.createTransport({
        //@ts-ignore
        service: "SendGrid",
        auth: {
          user: getEnv(EnvEnumType.SENDGRID_USERNAME),
          pass: getEnv(EnvEnumType.SENDGRID_PASSWORD),
        },
      });
    }

    return nodemailer.createTransport({
      //@ts-ignore
      host: String(getEnv(EnvEnumType.EMAIL_HOST)),
      port: getEnv(EnvEnumType.EMAIL_PORT),
      auth: {
        user: getEnv(EnvEnumType.EMAIL_USERNAME),
        pass: getEnv(EnvEnumType.EMAIL_PASSWORD),
      },
    });
  };

  // Send the actual email
  async send(template: String, subject: String) {
    // 1) Render HTML based on a pug template
    let html;

    try {
      html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });
    } catch (err) {
      console.log(err);
      const fallBackTemplates = require("./fallBackTemplates");
      html = fallBackTemplates.passwordResetTemplate
        .replace("{subject}", subject)
        .replace("{firstName}", this.firstName)
        .replace("{url}", this.url);
    }

    // 2) Define email options
    const mailOptions: Mail.Options = {
      from: this.from,
      to: this.to,
      subject: String(subject),
      html,
      text: htmlToText.fromString(html),
    };

    // console.log(mailOptions);

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
