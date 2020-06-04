const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

/**
 * Check if the email and password are valid, and if the confirm password matches the password
 * @param {String} email
 * @param {String} password
 * @param {String} confirmPassword
 * @returns an error object and a boolean to indicate if the data are valid
 */
exports.validatePasswordSignupData = (email, password, confirmPassword) => {
  let errors = {};

  // Email verifications
  if (!email || email === '') errors.email = 'auth/empty-email';
  else if (!emailRegex.test(email)) errors.email = 'auth/invalid-email';

  // Password verifications
  if (!password || password === '') errors.password = 'auth/empty-password';
  else if (!passRegex.test(password)) errors.password = 'auth/invalid-password';

  // Password match verifications
  if (!confirmPassword || confirmPassword === '')
    errors.confirmPassword = 'auth/empty-confirm-password';
  else if (password !== confirmPassword)
    errors.confirmPassword = 'auth/passwords-match-failed';

  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true,
  };
};

/**
 * Check if the email and password are valid during the login processing by password
 * @param {String} email
 * @param {String} password
 * @returns an error object and a boolean to indicate if the data are valid
 */
exports.validatePasswordLoginData = (email, password) => {
  let errors = {};

  // Email verifications
  if (!email || email === '') errors.email = 'auth/empty-email';
  else if (!emailRegex.test(email)) errors.email = 'auth/invalid-email';

  // Password verifications
  if (!password || password === '') errors.password = 'auth/empty-password';

  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true,
  };
};
