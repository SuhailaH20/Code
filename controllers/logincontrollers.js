// controllers/authController.js
const User = require('../models/Schema');
const bcrypt = require('bcrypt');

const userLogin = (req, res) => {
  res.render("pages/login", { errorMessage: null }); // Initialize with no error message
};

const UserLoginPost = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const trimmedPhoneNumber = phoneNumber.trim();
    const user = await User.findOne({ phoneNumber: trimmedPhoneNumber });
    // التحقق من الحقول المطلوبة
    if ( !phoneNumber || !password) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
  }
    if (!user) {
      return res.render("pages/login", { errorMessage: 'المستخدم غير مسجل' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      req.session.userName = user.name; // Store user name in session
      req.session.userId = user._id;     // Store the user's ObjectId in session
      return res.redirect('/Main'); // Redirect to main page
    } else {
      return res.render("pages/login", { errorMessage: 'كلمة المرور خطأ' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).render("pages/login", { errorMessage: 'Internal Server Error' });
  }
};

module.exports = { userLogin, UserLoginPost };