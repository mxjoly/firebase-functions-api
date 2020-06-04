const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

/**
 * Check if the new password and the confirm password are well-formatted and
 * if they match
 * @returns an error object and a boolean to indicate if the passwords are valid
 */
exports.validateNewPasswords = (newPassword, confirmPassword) => {
  let errors = {};

  // New password verifications
  if (!newPassword || newPassword === '')
    errors.newPassword = 'auth/empty-password';
  else if (!passRegex.test(newPassword))
    errors.newPassword = 'auth/invalid-password';

  // Password match verifications
  if (!confirmPassword || confirmPassword === '')
    errors.confirmPassword = 'auth/empty-confirm-password';
  else if (newPassword !== confirmPassword)
    errors.confirmPassword = 'auth/passwords-match-failed';

  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true,
  };
};
