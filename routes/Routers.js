const express = require("express");
const router = express.Router();
const userController = require("../controllers/control");
const loginController = require("../controllers/logincontrollers");
const { isAuthenticated } = require('../middlewares/auth');
const axios = require('axios');
// GET request
router.get('/', userController.indexrout);
router.get('/pages/login.html', loginController.userLogin);
router.get('/pages/createAccount.html', userController.createGet);
// Protect the dashboard route
router.get('/pages/Main.html', isAuthenticated, userController.MainGet); 
router.get('/get_recommendations', async (req, res) => {
    const { activity_type, neighborhood } = req.query;

    try {
        const flaskResponse = await axios.get(`http://localhost:5001/get_recommendations`, {
            params: { activity_type, neighborhood }
        });
        res.json(flaskResponse.data);
    } catch (error) {
        console.error('Error fetching data from Flask:', error);
        res.status(500).json({ error: 'Error fetching recommendations.' });
    }
});

// POST requests
router.post('/login', loginController.UserLoginPost);
router.post('/createAccount', userController.createPost);
router.post('/submitForm', userController.submitForm);

module.exports = router;
