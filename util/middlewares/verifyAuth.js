const admin = require('firebase-admin');

/**
 * Check the authorization token in the header of the request. If a uid is specified in the request parameters
 * or if the request body, we check if this uid is equals to the authorization token uid when it has been decoded.
 * @see https://firebase.google.com/docs/auth/admin/verify-id-tokens
 * @returns if the token is valid, pass to the next middleware function, else return an HTTP error
 */
module.exports = (req, res, next) => {
  let idToken;
  let checkRevoked = true; // Verify the ID token while checking if the token is revoked by passing checkRevoked true.

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    return res.status(401).json({ error: 'auth/unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(idToken, checkRevoked)
    .then((decodedToken) => {
      // Check if the uids (from the request and the HTTP headers) match
      if (req.params.uid || req.body.uid) {
        const uid = decodedToken.uid;
        if (uid !== req.params.uid && uid !== req.body.uid)
          return res.status(401).json({ error: 'auth/unauthorized' });
      }
      return next();
    })
    .catch((err) => {
      switch (err.code) {
        case 'auth/id-token-revoked': // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
        case 'auth/id-token-expired':
        case 'auth/argument-error': // The authorization token is invalid
        case 'auth/invalid-credential':
        default:
          return res.status(403).json({ error: err.code }); // Token is invalid.
      }
    });
};
