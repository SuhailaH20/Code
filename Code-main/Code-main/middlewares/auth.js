
const isAuthenticated = (req, res, next) => {
    if (req.session.userName) {
      return next(); // Proceed to the next middleware/route handler
    } else {
      res.redirect('/pages/login.html'); // Redirect to login if not authenticated
    }
  };
  
  module.exports = { isAuthenticated };
  