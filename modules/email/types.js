/**
 * Enum the types of action managed by emails. The values of there must
 * be equals to the names of the cloud functions.
 */
const types = {
  /**
   * Email send to reset the password (only for password login type)
   */
  RESET_PASSWORD_ASK: 'reset_password_ask',
  /**
   * Email which informs user he couldn't reset his account password because of his login
   * type (external provider used like google or facebook)
   */
  RESET_PASSWORD_UNAVAILABLE: 'reset_password_unavailable',
};

module.exports = types;
