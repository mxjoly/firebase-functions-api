/**
 * Calculate the age of an user with his birthday date
 * @param {String} birthday - MM/DD/YYYY
 * @returns {Number} - The age of the user
 */
const calculateAge = (birthday) => {
  let [month, date, year] = birthday.split('/');
  let dateBirthday = new Date(year, month, date);
  let ageDifMs = Date.now() - dateBirthday.getTime(); // birthday is a date
  let ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

/**
 * Get the body of a new profile document
 * @param {firebase.auth.UserCredential} data
 * @returns {Object} - The data of the document
 */
exports.createProfileDocument = (data) => {
  const { uid, photoURL } = data.user;
  let document = {
    uid,
    photoURL,
    username: null,
    gender: null,
    age: null,
    bio: null,
    coords: null, // geolocation
  };
  // in case of social login (facebook, google)
  if (data.additionalUserInfo.profile) {
    const { name, gender, birthday } = data.additionalUserInfo.profile;
    Object.assign(document, {
      username: name ? name.split(' ')[0] : null, // name = "<first_name> <last_name>"
      gender: gender ? gender : null, // gender from facebook signin by adding user_gender permission
      age: birthday ? calculateAge(birthday) : null, // birthday from facebook signin by adding user_birthday permission
    });
  }
  return document;
};
