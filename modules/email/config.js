/**
 * Enum the configs of email transport
 */
const configs = {
  /**
   * The domain name
   */
  DOMAIN: '__________',

  /**
   * The hostname or IP address to connect to
   */
  HOST: '__________',

  /**
   * The port to connect to, default to 587 if secure is false
   * @see https://nodemailer.com/smtp/
   */
  PORT: 465,

  /**
   * If true, use TLS
   */
  SECURE: true,

  /**
   * The email address used to send email
   */
  AUTH_USER: '__________',

  /**
   * The password of the address used to send email
   */
  AUTH_PASS: '__________',

  /**
   * The from field of the emails sent
   */
  FROM: '"EXAMPLE" <support@example.com>',

  /**
   * The selector is specified in the public key format at the beginning :
   * @default <selector>.<subdomain>.<domain>.<extension>.
   * @see https://caillaud.fr/phpmailer-envoyer-mails-signes-dkim/ - To set up dkim keys
   */
  DKIM_SELECTOR: '__________',

  /**
   * The path of the dkim public key file (the dkim public key is stored on the dns records of the domain)
   * @see https://dkimcore.org/tools/keys.html - To generate dkim keys
   */
  DKIM_PUBLIC_KEY: './modules/email/certificates/dkim-public.pem',

  /**
   * The path to the dkim private key file (the dkim private key is passed in the email's headers to sign them)
   * @see https://dkimcore.org/tools/keys.html - To generate dkim keys
   */
  DKIM_PRIVATE_KEY: './modules/email/certificates/dkim-private.pem',
};

module.exports = configs;
