const admin = require('firebase-admin');

/**
 * Get the body a new user document
 * @param {firebase.auth.UserCredential} data
 * @returns {Object} - The data of the document
 */
exports.createUserDocument = (data) => {
  const { uid, providerData, email, phoneNumber, emailVerified } = data.user;
  const { creationTime, lastSignInTime } = data.user.metadata;
  return {
    uid,
    provider: providerData[0].providerId,
    emailVerified,
    isNew: data.additionalUserInfo.isNewUser,
    membership: 'free',
    profile: admin.firestore().doc('profiles/' + uid),
    contact: {
      email,
      phoneNumber,
    },
    metadata: {
      createdAt: new Date(creationTime).getTime(),
      lastLoginAt: new Date(lastSignInTime).getTime(),
    },
  };
};
