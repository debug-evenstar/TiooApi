"use strict";

const nodemailer = require("nodemailer");

require('dotenv').config();

const utils = require('../utils/file');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_SMTP_USERNAME,
        pass: process.env.MAIL_SMTP_PASSWORD
    },
    tls: { rejectUnauthorized: false }
});


class Mailer {

    constructor() {
        this.Mail = { text: "" };
    }

    from(from, name) {
        this.Mail.from = name
            ? `${name} <${from}>`
            : from;
        return this;
    }


    subject(subject) {
        this.Mail.subject = subject;
        return this;
    }


    to(recipient) {
        this.Mail.to = recipient;
        return this;
    }

    text(text) {
        this.Mail.text = text;
        return this;
    }

    template(template, data = {}) {
        this.Mail.html = utils.loadTemplate(template, data);
        return this;
    }

    async send() {
        return await transporter.sendMail(this.Mail);
    }


}

module.exports = () => new Mailer();

