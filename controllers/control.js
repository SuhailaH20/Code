// control.js
const User = require('../models/Schema');

const indexrout = (req, res) => {
    res.render("index", {});
}

//create account
const createGet = (req, res) => {
    res.render("pages/createAccount", {});
  }
  
  // POST route for creating an account
  const createPost = async (req, res) => {
    try {
      const { idNumber } = req.body;
      const trimmedIdNumber = idNumber.trim();
  
      // Check if the user already exists
      const existingUser = await User.findOne({ idNumber: trimmedIdNumber });
      if (existingUser) {
        return res.json({ message: 'المستخدم مسجل مسبقا' });
      }
  
      const user = new User(req.body);
      await user.save();
      
      // Redirect to the landing page
      //res.sendFile(path.join(__dirname, '../views/LandingPage.html')); // Adjust the path as necessary
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  

module.exports = { indexrout,createPost,createGet };
