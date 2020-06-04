const inlineCss = require('inline-css');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const EmailTypes = require('./types');
const {
  getHead,
  getStyles,
  getContent,
  getBody,
  getFooter,
} = require('./templates');

/**
 * Look for locales resources depending of the user language
 * @param {String} lang - A language code (en, fr, ...)
 * @returns The locales resources
 */
const getLocales = (lang) => {
  let file = path.resolve(
    path.relative(process.cwd(), __dirname),
    `locales/${lang}.json`
  );
  if (fs.existsSync(file)) {
    return require(`./locales/${lang}.json`);
  } else {
    return require(`./locales/en.json`); // default locales
  }
};

/**
 * Get the subject of email according to the type of email and the language used by the user
 * @param {String} type - The type of email
 * @param {String} lang - A language code indicating the language to use in the email
 */
exports.getEmailSubject = async (type, lang) => {
  const locales = await getLocales(lang);
  return locales[type].subject;
};

/**
 * Build the email according to the type of email and the language used by the user
 * @param {String} type - The type of the email
 * @param {Object} options - The additional options of the email
 */
exports.buildEmail = async (type, options) => {
  let locales = await getLocales(options.language);
  let data = await addData(type, locales[type], options);
  if (data) {
    let html = `
      <!DOCTYPE html>
        <html lang='${options.language}'>
        ${getHead(getStyles())}
        ${getBody(getContent(data, type), getFooter(data, type))}
      </html>
    `;
    // Email html format doesn't applied embedded styles (in header), only
    // inline styles are read. As we separate different elements of email like
    // the styles in header, we need convert these to inline styles.
    return inlineCss(html, { url: ' ' });
  }
  return null;
};

/**
 * Add data (strings that cannot be translate like urls) to the strings resources
 * depending of the email's content requirements
 * @param {String} type - The type of the email
 * @param {Object} data - The specific data of the emailto override
 * @param {Object} options - The additional options
 */
const addData = (type, data, options) => {
  switch (type) {
    case EmailTypes.RESET_PASSWORD_ASK:
      return Object.assign(data, {
        button_ref: `https://${config.DOMAIN}/${options.language}/reset-password/?token=${options.token}`,
      });
    default:
      return data;
  }
};
