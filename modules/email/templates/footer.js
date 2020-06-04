const EmailTypes = require('../types');

/**
 * Default template of the email footer
 * @param {Object} data - The string data to use in the email
 */
const defaultFooter = (data) => {
  return `
    <div class="footer">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td class="content-block contact">
            <span id="contact">${data.contact}</span>
          </td>
        </tr>
      </table>
    </div>
  `;
};

/**
 * To get the footer of the email
 * @param {Object} data - The string data to use in the email
 * @param {String} type - The type of the email
 */
module.exports.getFooter = (data, type) => {
  switch (type) {
    default:
      return defaultFooter(data);
  }
};
