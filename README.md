# Firebase - Basic API

## Presentation

This project is using [Node.js](https://nodejs.org/) with [Firebase](https://firebase.google.com/) to deploy [Cloud functions](https://firebase.google.com/docs/functions) as an API.

## Stack

- [Node.js](https://nodejs.org/)
- [Firebase](https://firebase.google.com/)
- [Express](https://expressjs.com/)

## Features 

- Basic authentification actions : login, signup, signout (with a password, Facebook and Google).
- Save the users in [Cloud Firestone](https://firebase.google.com/docs/firestore) with a profile and credential document.
- Different functions to manage a user (update the profile, update the password, ask for resetting the password).
- Control the requests by the headers (authentification token verification).
- Possibility to send emails with [nodemailer](https://nodemailer.com/about/).

## Quick Start

```bash
# Install dependencies
npm install

# Log in to firebase account
node_modules/.bin/firebase login

# Choose a firebase project
node_modules/.bin/firebase use <project_id>

# Test locally
npm run serve

# Deploy to firebase
npm run deploy
```

## Configuration

- **Firebase configuration** :
  - Log in to your firebase account with the command `node_modules/.bin/firebase login`.
  - Update the file `.firebaserc` with your own firebase projects id. You can get them using `node_modules/.bin/firebase projects:list`.
  - Set your project's credentials in `/config/credential.js` (https://firebase.google.com/docs/web/setup#config-object) and your service account key in `/config/service-account.json` (from the settings of the Firebase project)
- **Modules** :
  - **Email** (`/modules/email`):
    - Set your own transport config in `config.js`.
    - Set the DKIM keys in the folder `certificates`: go to https://dkimcore.org/tools/keys.html and follow instructions specified in https://caillaud.fr/phpmailer-envoyer-mails-signes-dkim/ to set yours.
    - Go to your domain configuration and add a new DNS record with subdomain `<selector>._domainkey` (don't forget to modify the selector name in the public key in case of custom selector). The selector is specified in the public key format at the beginning : `<selector>.<subdomain>.<domain>.<extension>.`. To complete the DNS record, complete the public key with the previous key generated.
    - You can set your own custom email templates in the folder `templates`.
