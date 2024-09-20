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
        console.log('Received idNumber:', idNumber);
        const trimmedIdNumber = idNumber.trim();
      
        const existingUser = await User.findOne({ idNumber: trimmedIdNumber });
        if (existingUser) {
          return res.json({ message: 'المستخدم مسجل مسبقا' });
        }
      
        const user = new User(req.body);
        console.log('Saving user:', user);
        await user.save();
        res.json({ message: 'User saved successfully' });
      } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
      }
      
  };
  
//Get request form
const formGet = (req, res) => {
    res.render("pages/form", {});
  }

module.exports = { indexrout,createPost,createGet,formGet };
