const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router();
router.post('/register-user', UserController.register);
router.post('/login-user', UserController.login);
router.get('/getusers', UserController.getUsers);
router.get('/getlistmode1', UserController.getlistMode1);
router.get('/logout', UserController.logout);
module.exports = router