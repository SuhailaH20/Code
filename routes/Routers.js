const express = require("express");
const router = express.Router();
const userController = require("../controllers/control");
const loginController = require("../controllers/logincontrollers");
const { isAuthenticated } = require('../middlewares/auth');

// GET request
router.get('/', userController.indexrout);
router.get('/pages/login.html', loginController.userLogin);
router.get('/pages/createAccount.html', userController.createGet);
// Protect the dashboard route
router.get('/pages/form.html', isAuthenticated, userController.formGet); 

// POST requests
router.post('/login', loginController.UserLoginPost);
router.post('/createAccount', userController.createPost);
router.post('/submitForm', userController.submitForm);

module.exports = router;
