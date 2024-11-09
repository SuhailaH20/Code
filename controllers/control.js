// control.js
const User = require('../models/Schema');
const FormSubmission = require('../models/BusinessSchema'); 
const SavedRecommendation = require('../models/SavedRecommendation');  
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
    const response = await axios.get('http://localhost:5001/');
    const activities = response.data.activities;
    const neighborhoods = response.data.neighborhoods;
    const userName = req.session.userName;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    // Fetch data from both tables for the report
    const formSubmissions = await FormSubmission.find({ userId }).lean();
    formSubmissions.forEach(item => {
        item.type = 'طلب مدخل';
    });

    const savedRecommendations = await SavedRecommendation.find({ userId }).lean();
    savedRecommendations.forEach(item => {
        item.type = 'اقتراح';
    });

    const combinedData = [...formSubmissions, ...savedRecommendations];

    // Pass everything to the main page render, including combined data for the report
    res.render('pages/Main', { activities, neighborhoods, userName, combinedData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
};


//Get Recommendations
const GetRecommendations = async (req, res) => {
  const { activity_type, neighborhood, lat, lng } = req.query;  // Include lat and lng

  try {
      const flaskResponse = await axios.get('http://localhost:5001/get_recommendations', {
          params: { activity_type, neighborhood, lat, lng }
      });
      res.json(flaskResponse.data);
  } catch (error) {
      console.error('Error fetching data from Flask:', error);
      res.status(500).json({ error: 'Error fetching recommendations.' });
  }
};

//Get success
    const successGet = async (req, res) => {
            res.render('pages/success');
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
      const {
          businessType,
          subBusinessType,
          activityType,
          partOfLargerBuilding,
          buildingType,
          parkingSpaces,
          onCommercialStreet,
          logisticsArea,
          warehouseArea,
          step3Result,
          step3Status, 
          step4Result
      } = req.body;

      if (!req.session.userId) {
          return res.status(401).send('User not authenticated');
      }

      const formSubmission = new FormSubmission({
          userId: req.session.userId,
          businessType,
          subBusinessType,
          activityType,
          partOfLargerBuilding,
          buildingType,
          parkingSpaces: parkingSpaces ? parseInt(parkingSpaces, 10) : null,
          onCommercialStreet,
          logisticsArea,
          warehouseArea,
          step3Result,
          step3Status,  
          step4Result
      });
      console.log('Form submission data:', req.body);
      await formSubmission.save();
      res.redirect('/pages/success.html');
  } catch (error) {
      console.error('Error saving form data:', error);
      res.status(500).send('Internal Server Error');
  }
};

const saveRecommendation = async (req, res) => {
  try {
      const { userId, recommendation } = req.body;

      if (!recommendation || !recommendation.summary) {
          console.log('Incomplete recommendation data:', recommendation);
          return res.status(400).send('Recommendation data is incomplete.');
      }

     
      const normalizedNearbyPois = recommendation.nearby_pois.map(poi => 
          typeof poi === 'string' 
              ? { name: poi, type: 'unknown' }  // Assign a default `type` for string entries
              : poi  // Keep the original object if it's already in the correct format
      );

      const savedRecommendation = new SavedRecommendation({
          userId: req.session.userId,
          summary: recommendation.summary,
          success_rate: recommendation.success_rate,
          nearby_pois: normalizedNearbyPois, 
          competitors: recommendation.competitors,
          location: {
              lat: recommendation.lat,
              lng: recommendation.lng
          }
      });

      await savedRecommendation.save();
      res.status(200).send('Recommendation saved successfully');
  } catch (error) {
      console.error('Error saving recommendation:', error);
      res.status(500).send('Internal Server Error');
  }
};


module.exports = { indexrout, createPost, createGet, MainGet,saveRecommendation, submitForm,GetRecommendations,successGet };
