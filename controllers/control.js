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

// Get request form
const formGet = (req, res) => {
    res.render("pages/form", {});
}

module.exports = { indexrout, createPost, createGet, formGet };