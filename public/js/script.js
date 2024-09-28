// JavaScript to display validation errors
const phoneNumber = document.querySelector('input[name="phoneNumber"]');
const passwordInput = document.querySelector('input[name="password"]');
const phoneNumberError = document.getElementById('phoneNumberError');
const passwordError = document.getElementById('passwordError');


// Check for errors when form submits
document.querySelector('form').addEventListener('submit', function(event) {
  let valid = true; // To track overall form validity

  // Validate phone number
  if (!phoneNumber.value || isNaN(phoneNumber.value)) {
    phoneNumber.classList.add('is-invalid');
    phoneNumberError.innerText = "رقم الهاتف مطلوب";
    phoneNumberError.style.float = "right";
    valid = false;
  } else if (phoneNumber.value.length !== 10) {
    phoneNumber.classList.add('is-invalid');
    phoneNumberError.innerText = "رقم الهاتف يجب أن يتكون من 10 أرقام.";
    phoneNumberError.style.float = "right";
    valid = false;
  } else {
    phoneNumber.classList.remove('is-invalid');
    phoneNumberError.innerText = "";
  }

  // Validate password
  if (!passwordInput.value) {
    passwordInput.classList.add('is-invalid');
    passwordError.innerText = "كلمة المرور مطلوبة.";
    passwordError.style.float = "right";
    valid = false;
  } else {
    passwordInput.classList.remove('is-invalid');
    passwordError.innerText = "";
  }

  // Check if user exists and password matches
  if (valid) {
    const user = users.find(u => u.phoneNumber === phoneNumber.value);
    if (!user) {
      phoneNumber.classList.add('is-invalid');
      phoneNumberError.innerText = "لا يوجد حساب مرتبط بهذا الرقم.";
      phoneNumberError.style.float = "right";
      valid = false;
    } else if (user.password !== passwordInput.value) {
      passwordInput.classList.add('is-invalid');
      passwordError.innerText = "كلمة المرور غير صحيحة.";
      passwordError.style.float = "right";
      valid = false;
    }
  }

  // Prevent form submission if any validation failed
  if (!valid) {
    event.preventDefault();
  }
});