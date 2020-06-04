const EmailTypes = require('../types');

/**
 * Default template of the email header
 * @param {Buffer} styles - The CSS styles to set in the head
 */
const defaultHead = (styles) => {
  return `
    <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
      <title></title>
      <style>
        ${styles}
      </style>
    </head>
  `;
};

/**
 * To get the head of the email
 * @param {Buffer} styles - The styles to set in the head
 * @param {String} type - The type of the email
 */
module.exports.getHead = (styles, type) => {
  switch (type) {
    default:
      return defaultHead(styles);
  }
};
