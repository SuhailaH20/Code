

const User = require('../models/loginmodels');


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
        // Authentication successful
        //res.sendFile(path.join(__dirname, 'frontend', 'LandingPage.html'));
      } else {
        // Authentication failed
        res.send('كلمة المرور خطأ ');
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
}
module.exports ={ userLogin, UserLoginPost} ;