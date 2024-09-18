const express = require("express");
const router = express.Router();
const userController= require("../controllers/control")
const loginController = require("../controllers/logincontrollers");


router.get('/',userController.indexrout);
router.get('/pages/login.html',loginController.userLogin);
router.get('/pages/createAccount.html',userController.createGet);



//post request
router.post('/login', loginController.UserLoginPost);

module.exports = router;