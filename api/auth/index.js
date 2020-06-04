const admin = require('firebase-admin');
const firebase = require('firebase');

const {
  validatePasswordSignupData,
  validatePasswordLoginData,
} = require('./validators');
const { createUserDocument } = require('../../util/database/users');
const { createProfileDocument } = require('../../util/database/profiles');

/**
 * Generic function to sign up an user
 * @returns a result code and a firebase id token in case of success, or the errors
 */
exports.signUpUser = (req, res) => {
  switch (req.params.provider) {
    case 'password':
      return signUpUserWithPassword(req, res);
    default:
      return res
        .status(500)
        .json({ error: `Signup type invalid : ${req.params.provider}` });
  }
};

/**
 * Generic function to sign in an user
 * @returns a result code and a token in case of success, or the errors
 */
exports.logInUser = (req, res) => {
  switch (req.params.provider) {
    case 'password':
      return logInUserWithPassword(req, res);
    case 'facebook':
      return logInUserWithFacebook(req, res);
    case 'google':
      return logInUserWithGoogle(req, res);
    default:
      return res
        .status(500)
        .json({ error: `Login type invalid : ${req.params.provider}` });
  }
};

/**
 * Create a user and profile document
 * @param {firebase.auth.UserCredential} data
 */
const createDocuments = (data) => {
  admin
    .firestore()
    .collection('profiles')
    .doc(data.user.uid)
    .set(createProfileDocument(data));
  admin
    .firestore()
    .collection('users')
    .doc(data.user.uid)
    .set(createUserDocument(data));
};

/**
 * Sign up a user giving in the request body an email, a password, and a confirm password.
 * 1) Validate the format of the email, the password, and the confirm password and check if
 * the passwords match
 * 2) Create the user and the documents associated (profile and user document)
 * @returns a result code, the uid, and a firebase id token in case of success, or the errors
 */
const signUpUserWithPassword = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirm_password;

  const { errors, valid } = validatePasswordSignupData(
    email,
    password,
    confirmPassword
  );

  if (!valid) {
    return res.status(400).json({ errors });
  }

  let uid;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
      createDocuments(data);
      uid = data.user.uid;
      return data.user.getIdToken();
    })
    .then((token) => {
      console.log(`User ${email} signed up successfully with a password`);
      return res.status(201).json({
        result: 'auth/success-signup',
        uid,
        token,
      });
    })
    .catch((err) => {
      switch (err.code) {
        case 'auth/weak-password':
        case 'auth/email-already-in-use':
          return res.status(403).json({ errors: { email: err.code } });
        default:
          return res.status(500).json({ errors: { general: err.code } });
      }
    });
};

/**
 * When the user logged in, we update :
 * - the last login timestamp
 * - the boolean indicating if the user is new (older than one week)
 * @param {firebase.auth.UserCredential} data
 */
const updateUserData = (data) => {
  const {
    creationTime: createdAt,
    lastSignInTime: lastLoginAt,
  } = data.user.metadata;
  const newUserData = { 'metadata.lastLoginAt': Date.now() }; // nested object update
  // 604800000 ms = 1 week
  if (lastLoginAt > createdAt + 604800000) {
    Object.assign(newUserData, { isNew: false });
  }
  admin
    .firestore()
    .collection('users')
    .doc(data.user.uid)
    .update(newUserData)
    .catch((err) => {});
};

/**
 * Log in a user with his email and password.
 * 1) Validate the format of the email, the password
 * 2) Update the last login timestamp in the user document and perhaps if he's always new
 * @returns a result code, the uid, and a firebase id token in case of success, or the errors
 */
const logInUserWithPassword = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, valid } = validatePasswordLoginData(email, password);

  if (!valid) {
    return res.status(400).json({ errors });
  }

  let uid;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((data) => {
      updateUserData(data);
      uid = data.user.uid;
      return data.user.getIdToken();
    })
    .then((token) => {
      console.log(`User ${email} logged in successfully with a password`);
      return res.status(200).json({ result: 'auth/success-login', uid, token });
    })
    .catch((err) => {
      switch (err.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-email':
        case 'auth/user-not-found':
        case 'auth/user-disabled':
        case 'auth/user-token-expired':
        default:
          return res.status(403).json({ error: err.code });
      }
    });
};

/**
 * Log in a user with a Facebook account. This could be also a signup.
 * 1) Check the Facebook access token in the body of the request
 * 2) Create the Firebase credential and sign in it
 * 3) In case of | signup : create the user and profile documents in firestone,
 *               | signin : update the last login timestamp in the user collection and if he's no longer new
 * @returns a result code, the uid, and a firebase id token in case of success, or the errors
 */
const logInUserWithFacebook = (req, res) => {
  const token = req.body.access_token;
  if (!token || token === '') {
    return res
      .status(400)
      .json({ error: 'auth/facebook/invalid-access-token' });
  }

  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  let isNew, email, uid;

  firebase
    .auth()
    .signInWithCredential(credential)
    .then((data) => {
      isNew = data.additionalUserInfo.isNewUser;
      if (isNew) {
        createDocuments(data);
      } else {
        updateUserData(data);
      }
      uid = data.user.uid;
      email = data.user.email;
      return data.user.getIdToken();
    })
    .then((token) => {
      console.log(
        `User ${email} ` +
          (isNew ? 'signed up' : 'logged in') +
          ' successfully with Facebook'
      );
      return res.status(isNew ? 201 : 200).json({
        result: isNew ? 'auth/success-signup' : 'auth/success-login',
        uid,
        token,
      });
    })
    .catch((err) => {
      switch (err.code) {
        case 'auth/user-disabled':
        case 'auth/account-exists-with-different-credential':
        case 'auth/user-token-expired':
        default:
          return res.status(403).json({ error: err.code });
      }
    });
};

/**
 * Log in a user with a Google account. This could be also a signup.
 * 1) Check the Google id token in the body of the request
 * 2) Create the Firebase credential and sign in it
 * 3) In case of | signup : create the user and profile documents in firestone,
 *               | signin : update the last login timestamp in the user collection and if he's no longer new
 * @returns a result code and a firebase id token in case of success, or the errors
 */
const logInUserWithGoogle = (req, res) => {
  const token = req.body.id_token;
  if (!token || token === '') {
    return res.status(400).json({ error: 'auth/google/invalid-id-token' });
  }

  const credential = firebase.auth.GoogleAuthProvider.credential(token);
  let isNew, email, uid;

  firebase
    .auth()
    .signInWithCredential(credential)
    .then((data) => {
      isNew = data.additionalUserInfo.isNewUser;
      if (isNew) {
        createDocuments(data);
      } else {
        updateUserData(data);
      }
      uid = data.user.uid;
      email = data.user.email;
      return data.user.getIdToken();
    })
    .then((token) => {
      console.log(
        `User ${email} ` +
          (isNew ? 'signed up' : 'logged in') +
          ' successfully with Google'
      );
      return res.status(isNew ? 201 : 200).json({
        result: isNew ? 'auth/success-signup' : 'auth/success-login',
        uid,
        token,
      });
    })
    .catch((err) => {
      switch (err.code) {
        case 'auth/user-disabled':
        case 'auth/user-token-expired':
        default:
          return res.status(403).json({ error: err.code });
      }
    });
};

/**
 * Sign out a user by revoking his refresh token
 * @returns a result code in case of success or the errors
 */
exports.signOutUser = (req, res) => {
  admin
    .auth()
    .revokeRefreshTokens(req.params.uid)
    .then(() => {
      return admin.auth().getUser(req.params.uid);
    })
    .then((userRecord) => {
      console.log(`User ${userRecord.email} signed out successfully`);
      return res.status(200).json({ result: 'auth/success-signout' });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};
