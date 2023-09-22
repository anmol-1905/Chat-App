const express = require('express');
const router = express.Router();
const {registerUser, login, getrAllUsers} = require('../controllers/userControllers');
const {protect} = require('../middleware/authMiddleware');
router
    .route("/register")
    .post(registerUser);
router
    .route("/login")
    .post(login);
router
    .route("/all-users")
    .get(protect, getrAllUsers);
module.exports = router;