const User = require('../models/Schema');

const userLogin = (req, res) => {
  res.render("pages/login", { errorMessage: null }); // Initialize with no error message
}

const bcrypt = require('bcrypt');

const UserLoginPost = async (req, res) => {
  try {
    const { idNumber, password } = req.body;
    const trimmedIdNumber = idNumber.trim();
    const user = await User.findOne({ idNumber: trimmedIdNumber });

    if (!user) {
      // User not found, stay on login page and show error message
      return res.render("pages/login", { errorMessage: 'المستخدم غير مسجل' });
    }

    // Compare the hashed password in the database with the entered password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      // Store the user's name in the session
      req.session.userName = user.name;
      return res.redirect('/');
    } else {
      return res.render("pages/login", { errorMessage: 'كلمة المرور خطأ' });
    }

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).render("pages/login", { errorMessage: 'Internal Server Error' });
  }
};


module.exports = { userLogin, UserLoginPost };
