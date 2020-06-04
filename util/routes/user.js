const express = require('express');
const {
  deleteUser,
  updateProfile,
  updatePassword,
  resetPasswordAsk,
  resetPassword,
} = require('../../api/user');
const verifyAuth = require('../middlewares/verifyAuth');

const route = express.Router();

route.delete('/:uid/delete', verifyAuth, deleteUser);
route.put('/:uid/update_profile', verifyAuth, updateProfile);
route.put('/:uid/update_password', verifyAuth, updatePassword);
route.put('/:uid/reset_password', resetPassword); // reset the password when the last was forgotten
route.post('/reset_password', resetPasswordAsk); // ask for resetting the password

module.exports = route;
