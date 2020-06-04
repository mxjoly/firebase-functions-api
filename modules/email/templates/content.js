const EmailTypes = require('../types');

/**
 * Default template of the email content
 * @param {Object} data - The string data to use in the email
 */
const defaultContent = (data) => {
  return `
    <table role="presentation" class="main">
      <tr>
        <td class="wrapper">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <img id="logo" src="https://www.webrankinfo.com/dossiers/wp-content/uploads/google-logo-carre-2015-09-400.png"/>
                <h1>${data.title}</h1>
                <p>${data.description}</p>
                <hr>
                <p>${data.warnings}<a href="mailto:support@example.com">support@example.com</a></p>
                <p>${data.wish}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

/**
 * Default template of the email content with a button link
 * @param {Object} data - The string data to use in the email
 */
const contentWithButton = (data) => {
  return `
    <table role="presentation" class="main">
      <tr>
        <td class="wrapper">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <img id="logo" src="https://www.webrankinfo.com/dossiers/wp-content/uploads/google-logo-carre-2015-09-400.png"/>
                <h1>${data.title}</h1>
                <p>${data.description}</p>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                  <tbody>
                    <tr>
                      <td align="center">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                          <tbody>
                            <tr>
                              <td> <a href="${data.button_ref}" target="_blank">${data.button_title}</a> </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr>
                <p>${data.warnings}<a href="mailto:support@example.com">support@example.com</a></p>
                <p>${data.wish}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

/**
 * To get the body of the email
 * @param {Object} data - The string data to use in the email
 * @param {String} type - The type of email
 */
module.exports.getContent = (data, type) => {
  switch (type) {
    case EmailTypes.RESET_PASSWORD_ASK:
      return contentWithButton(data);
    case EmailTypes.RESET_PASSWORD_UNAVAILABLE:
      return defaultContent(data);
    default:
      console.error('Cannot load the email content for the type :', type);
      return undefined;
  }
};
