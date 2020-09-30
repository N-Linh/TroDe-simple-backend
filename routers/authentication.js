const express = require('express');
const authenticationController = require('../controllers/authenticate');
const router = express.Router();

router.post("/signup",  authenticationController.signup)

router.post("/login", authenticationController.login);

module.exports = router;