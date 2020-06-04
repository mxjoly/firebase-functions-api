const fs = require('fs');
const path = require('path');

/**
 * Default styles for emails
 */
const defaultStyles = fs.readFileSync(
  path.relative(process.cwd(), __dirname) + '/styles/default.css'
);

/**
 * To get the styles of the email
 */
module.exports.getStyles = () => {
  return defaultStyles;
};
