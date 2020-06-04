const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');

const config = require('./config');
const { getEmailSubject, buildEmail } = require('./factory');

/**
 * Send an email
 * @param {String} type - The type of email to send
 * @param {Object} options - Additional options
 */
module.exports.sendEmail = (type, options) => {
  return new Promise(async (resolve, reject) => {
    let emailOptions = await getEmailOptions(options, type);
    return getTransport().sendMail(emailOptions, (error, info) => {
      if (error) reject(error);
      else resolve(info);
    });
  });
};

/**
 * Create smtp transport
 * @see https://nodemailer.com/smtp/
 */
const getTransport = () => {
  return nodemailer.createTransport(
    smtpTransport({
      host: config.HOST,
      port: config.PORT,
      secure: config.SECURE,
      auth: { user: config.AUTH_USER, pass: config.AUTH_PASS },
    })
  );
};

/**
 * Build the email object properties
 * @param {Object} options - The additional options
 * @param {String} type - The type of email to send
 * @see https://nodemailer.com/dkim/
 */
const getEmailOptions = async (options, type) => {
  return {
    from: config.FROM,
    to: options.recipient,
    subject: await getEmailSubject(type, options.language),
    html: await buildEmail(type, options),
    dkim: {
      domainName: config.DOMAIN,
      keySelector: config.DKIM_SELECTOR,
      privateKey: fs.readFileSync(config.DKIM_PRIVATE_KEY),
    },
  };
};
