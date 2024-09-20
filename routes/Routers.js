const express = require("express");
const router = express.Router();
const userController= require("../controllers/control")
const loginController = require("../controllers/logincontrollers");

//GET request
router.get('/',userController.indexrout);
router.get('/pages/login.html',loginController.userLogin);
router.get('/pages/createAccount.html',userController.createGet);
router.get('/pages/form.html',userController.formGet);


//post request
router.post('/login', loginController.UserLoginPost);
router.post('/createAccount', userController.createPost);


module.exports = router;