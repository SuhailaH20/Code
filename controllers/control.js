// control.js
const User = require('../models/Schema');
const FormSubmission = require('../models/BusinessSchema'); 
const bcrypt = require('bcrypt');
const axios = require('axios');
const indexrout = (req, res) => {
    const userName = req.session.userName || 'تسجيل دخول'; // Ensure userName is defined
    res.render("index", { userName }); // Pass userName to the view
}
// GET Requests
// إنشاء حساب
const createGet = (req, res) => {
    res.render("pages/createAccount", {});
}

// Get request form
const MainGet = async (req, res) => {
  try {
      const response = await axios.get('http://localhost:5001/'); // Flask root endpoint
      //test
      console.log(response.data);

      const activities = response.data.activities;
      const neighborhoods = response.data.neighborhoods;

      // Define a username retrieved from database
      const userName = req.session.userName;

      res.render('pages/Main', { activities, neighborhoods, userName });
  } catch (error) {
      console.error('Error fetching data from Flask:', error);
      res.status(500).send('Error fetching data from Flask');
  }
}
  
//Get Recommendations
const GetRecommendations = async (req, res) => {
  const { activity_type, neighborhood } = req.query;

  try {
      const flaskResponse = await axios.get('http://localhost:5001/get_recommendations', {
          params: { activity_type, neighborhood }
      });
      res.json(flaskResponse.data);
  } catch (error) {
      console.error('Error fetching data from Flask:', error);
      res.status(500).json({ error: 'Error fetching recommendations.' });
  }
};


// POST requests
// POST route لإنشاء حساب
const createPost = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;
    console.log('Received phoneNumber:', phoneNumber);
    
    // التحقق من الحقول المطلوبة
    if (!name || !phoneNumber || !email || !password) {
        return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    // تحقق من أن الاسم ثلاثي (بالإنجليزية أو بالعربية)
    const namePattern = /^([\u0621-\u064A]+\s?){2,3}$|^([a-zA-Z]+\s?){2,3}$/;
    const nameParts = name.trim().split(/\s+/); // تقسيم الاسم إلى أجزاء

    if (nameParts.length < 3 || nameParts.length > 3 || !namePattern.test(name)) {
        return res.status(400).json({ message: 'الرجاء مطابقة شروط الاسم' });
    }

    // التأكد من أن كلمة المرور غير فارغة وتفي بالشروط
    const trimmedPassword = password.trim();
    if (!trimmedPassword || 
        trimmedPassword.length < 8 || 
        !/[A-Z]/.test(trimmedPassword) || 
        !/[a-z]/.test(trimmedPassword) || 
        !/[0-9]/.test(trimmedPassword)) {
        return res.status(400).json({ message: 'الرجاء مطابقة شروط كلمة المرور' });
    }
   
    // تنظيف رقم الهاتف
    const trimmedPhoneNumber = phoneNumber.trim();

    // تحقق من صحة رقم الهاتف (مثال: يجب أن يتكون من 10 أرقام)
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(trimmedPhoneNumber)) {
        return res.status(400).json({ message: 'الرجاء مطابقة شروط رقم الهاتف' });
    }

    const existingUserByPhone = await User.findOne({ phoneNumber: trimmedPhoneNumber });
    if (existingUserByPhone) {
        return res.json({ message: 'المستخدم مسجل مسبقا' });
    }

    // تحقق من صحة البريد الإلكتروني
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'البريد الإلكتروني غير صالح.' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = new User({
      name,
      phoneNumber: trimmedPhoneNumber,
      email,
      password: hashedPassword 
    });

    console.log('Saving user:', user);
    await user.save();
    return res.redirect('/pages/login.html');
    
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller function to handle form submission
const submitForm = async (req, res) => {
    try {
      console.log('Form submission data:', req.body);
      
      const {
        businessType,
        subBusinessType,
        activityType,
        partOfLargerBuilding,
        buildingType,
        parkingSpaces,
        onCommercialStreet,
        logisticsArea,
        warehouseArea
      } = req.body;
  
      // Ensure the user is logged in and has an ID
      if (!req.session.userId) {
        return res.status(401).send('User not authenticated');
      }
  
      const formSubmission = new FormSubmission({
        userId: req.session.userId,  // Store the user's ObjectId
        businessType,
        subBusinessType,
        activityType,
        partOfLargerBuilding,
        buildingType,
        parkingSpaces: parkingSpaces ? parseInt(parkingSpaces, 10) : null,
        onCommercialStreet,
        logisticsArea,
        warehouseArea
      });
  
      await formSubmission.save();
      console.log('Form data saved successfully');
      
      res.redirect('/pages/form.html');
    } catch (error) {
      console.error('Error saving form data:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
module.exports = { indexrout, createPost, createGet, MainGet, submitForm,GetRecommendations };
