

const User = require('../models/Schema');


  const userLogin = (req, res) => {
    res.render("pages/login", {});
  }


  const UserLoginPost = async (req, res) => {
    try {
      const { idNumber, password } = req.body;
      const trimmedIdNumber = idNumber.trim(); // Trimming whitespace
      console.log(`Attempting to find user with ID Number: ${trimmedIdNumber}`); // Logging for debugging
      const user = await User.findOne({ idNumber: trimmedIdNumber });
  
      if (!user) {
        res.json({ message: 'المستخدم غير مسجل' });
        return;
      }
  
      // Check if the provided password matches the user's password
      if (user.password === password) {
        console.log('Redirecting to index page...');
        res.redirect('/');  // This should take you to the index page
      } else {
        res.send('كلمة المرور خطأ ');
      }
      
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
}
module.exports ={ userLogin, UserLoginPost} ;