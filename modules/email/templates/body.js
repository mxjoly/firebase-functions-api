/**
 * Get the default body
 * @param {string} content - The html content of the body as string
 * @param {string} footer - The html footer of the body content as string
 */
const defaultBody = (content, footer) => {
  return `
    <body>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
          <td class="container">
            <div class="content">
              ${content}
              ${footer}
            </div>
          </td>
        </tr>
      </table>
    </body>
  `;
};

/**
 * To get the body of the email
 * @param {string} content - The html content
 * @param {string} footer - The html footer
 */
module.exports.getBody = (content, footer) => {
  return defaultBody(content, footer);
};
