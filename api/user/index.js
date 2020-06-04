const admin = require('firebase-admin');
const firebase = require('firebase');
const jwt = require('jsonwebtoken');

const { sendEmail } = require('../../modules/email');
const EmailTypes = require('../../modules/email/types');
const { validateNewPasswords } = require('./validators');

/**
 * Delete a user (from the auth and database)
 * @returns a result code in case of success or the errors
 */
exports.deleteUser = (req, res) => {
  const uid = req.params.uid;
  admin
    .auth()
    .deleteUser(uid)
    .then(() => {
      admin.firestore().collection('users').doc(uid).delete();
      admin.firestore().collection('profiles').doc(uid).delete();
      console.log(`User ${uid} has been successfully deleted`);
      return res.status(200).json({ result: 'user/success-delete' });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

/**
 * Update the profile of a user
 */
exports.updateProfile = (req, res) => {
  admin
    .firestore()
    .collection('profiles')
    .doc(req.params.uid)
    .update(req.body)
    .then(() => {
      return res.status(200).json({ result: 'user/success-profile-update' });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'user/failed-profile-update' });
    });
};

/**
 * Update the password of an user when he is connected.
 * A reauthentification will be needed in the client !!
 */
exports.updatePassword = (req, res) => {
  // Get the user by the uid parameter in the request
  admin
    .auth()
    .getUser(req.params.uid)
    .then((userRecord) => {
      // Update the password
      admin
        .auth()
        .updateUser(userRecord.uid, { password: req.body.new_password })
        .then((userRecord) => {
          return res
            .status(200)
            .json({ result: 'user/success-password-update' });
        })
        .catch((err) => {
          switch (err.code) {
            case 'auth/weak-password':
            default:
              return res.status(500).json({ error: err.code });
          }
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'user/failed-password-update' });
    });
};

/**
 * Send an email with link that redirects to a page of the website which allows
 * to reset the password. This page is usable for one hour (token).
 */
exports.resetPasswordAsk = (req, res) => {
  admin
    .auth()
    .getUserByEmail(req.body.email)
    .then((userRecord) => {
      // We can reset password only if the account has been provided by a password
      let type =
        userRecord.providerData[0].providerId === 'password'
          ? EmailTypes.RESET_PASSWORD_ASK
          : EmailTypes.RESET_PASSWORD_UNAVAILABLE;

      // Creation of a token for 1 hour
      let secret =
        userRecord.passwordHash + '-' + userRecord.metadata.creationTime;
      let token = jwt.sign({ uid: userRecord.uid }, secret, {
        expiresIn: 3600, // 1 hour
      });

      let options = {
        uid: userRecord.uid,
        recipient: req.body.email,
        language: req.body.language,
        token,
      };

      sendEmail(type, options)
        .then((info) => {
          console.log('Email sent to :', info.envelope.to);
          return res.status(200).json({ result: 'user/success-email-send' });
        })
        .catch((err) => {
          console.error('Error trying to send an email :', err.message);
          return res.status(500).json({ error: 'user/failed-email-send' });
        });
    })
    .catch((err) => {
      return res.status(403).json({ error: err.code });
    });
};

/**
 * Reset a password when the last has been forgotten.
 */
exports.resetPassword = (req, res) => {
  const { newPassword, confirmPassword, token } = req.body;

  const { errors, valid } = validateNewPasswords(newPassword, confirmPassword);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  admin
    .auth()
    .getUser(req.params.uid)
    .then((userRecord) => {
      let secret =
        userRecord.passwordHash + '-' + userRecord.metadata.creationTime;
      jwt.verify(token, secret, (err, decoded) => {
        if (err)
          return res.status(403).json({ error: 'user/reset-token-expired' });
        if (decoded.uid === userRecord.uid)
          return res
            .status(200)
            .json({ result: 'user/success-password-reset' });
        return res.status(400).json({ error: 'user/reset-token-invalid' });
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: 'user/failed-password-reset' });
    });
};
