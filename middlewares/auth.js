
const isAuthenticated = (req, res, next) => {
    if (req.session.userName) {
      return next(); // Proceed to the next middleware/route handler
    } else {
      res.redirect('/pages/login.html'); // Redirect to login if not authenticated
    }
  };
  
  const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Could not log out. Try again.');
      }
      res.redirect('/'); // Redirect to login page after logout
    });
  };
  
  module.exports = { isAuthenticated, logout };
    

  