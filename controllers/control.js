// control.js
const User = require('../models/Schema');
const bcrypt = require('bcrypt');
const indexrout = (req, res) => {
    const userName = req.session.userName || 'تسجيل دخول'; // Ensure userName is defined
    res.render("index", { userName }); // Pass userName to the view
}
// إنشاء حساب
const createGet = (req, res) => {
    res.render("pages/createAccount", {});
}
  
// POST route لإنشاء حساب
const createPost = async (req, res) => {
  try {
    const { idNumber, name, phoneNumber, email, password } = req.body;
    const trimmedIdNumber = idNumber.trim();

    const existingUser = await User.findOne({ idNumber: trimmedIdNumber });
    if (existingUser) {
      return res.json({ message: 'المستخدم مسجل مسبقا' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = new User({
      name,
      idNumber: trimmedIdNumber,
      phoneNumber,
      email,
      password: hashedPassword 
    });

    await user.save();
    return res.redirect('/pages/login.html');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Internal Server Error');
  }
};



// Get request form
const formGet = (req, res) => {
    res.render("pages/form", {});
}

module.exports = { indexrout, createPost, createGet, formGet };