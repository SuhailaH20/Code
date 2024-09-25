 // JavaScript to display validation errors
 const form = document.querySelector('form');
 const nameInput = document.querySelector('input[name="name"]');
 const phoneNumberInput = document.querySelector('input[name="phoneNumber"]');
 const emailInput = document.querySelector('input[name="email"]');
 const passwordInput = document.querySelector('input[name="password"]');
 const nameError = document.getElementById('nameError');
 const phoneNumberError = document.getElementById('phoneNumberError');
 const emailError = document.getElementById('emailError');
 const passwordError = document.getElementById('passwordError');

 document.querySelector('form').addEventListener('submit', function(event) {

  if (!nameInput.value) {
    nameInput.classList.add("is-invalid");
    nameError.innerText = "الرجاء ادخال الاسم الثلاثي";
    nameError.style.float = "right";
    nameError.style.paddingBottom = "6px";
    event.preventDefault();
} else {
    // التعبير المنتظم للتحقق من الأسماء باللغة الإنجليزية أو العربية
    var namePattern = /^([\u0621-\u064A]{2,}\s){2,}[\u0621-\u064A]{2,}$|^([a-zA-Z]{2,}\s){2,}[a-zA-Z]{2,}$/;
    if (!namePattern.test(nameInput.value)) {
        nameInput.classList.add("is-invalid");
        nameError.innerText = "الرجاء ادخال اسم ثلاثي صحيح";
        nameError.style.float = "right";
        nameError.style.paddingBottom = "6px";
        event.preventDefault();
    } else {
        nameInput.classList.remove("is-invalid");
        nameError.innerText = "";
    }
}

   if (!phoneNumberInput.value || isNaN(phoneNumberInput.value)) {
     phoneNumberInput.classList.add('is-invalid');
     phoneNumberError.innerText = " الرجاء ادخال رقم الهاتف";
     phoneNumberError.style.float = "right";
     phoneNumberError.style.paddingBottom = "8px";
     event.preventDefault();
   } else if (phoneNumberInput.value.length !== 10) {
       phoneNumberInput.classList.add('is-invalid');
       phoneNumberError.innerText = "رقم الهاتف يجب أن يتكون من 10 أرقام";
       phoneNumberError.style.float = "right";
       phoneNumberError.style.paddingBottom = "10px";
       event.preventDefault();
   } else {
       phoneNumberInput.classList.remove('is-invalid');
       phoneNumberError.innerText = "";
   }

   if (!emailInput.value) {
   emailInput.classList.add("is-invalid");
   emailError.innerText = "الرجاء ادخال البريد الإلكتروني";
   emailError.style.float = "right";
   emailError.style.paddingBottom = "8px";
   event.preventDefault();
   } else {
     var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     if (!emailPattern.test(emailInput.value)) {
       emailInput.classList.add("is-invalid");
       emailError.innerText = "الرجاء ادخال بريد إلكتروني صحيح";
       emailError.style.float = "right";
       emailError.style.paddingBottom = "8px";
       event.preventDefault();
     } else {
       emailInput.classList.remove("is-invalid");
       emailError.innerText = "";
     }
   }

if (!passwordInput.value) {
 passwordInput.classList.add("is-invalid");
 passwordError.innerText = "الرجاء ادخال كلمة المرور";
 passwordError.style.float = "right";
 passwordError.style.paddingBottom = "8px";
 event.preventDefault();
} else {
 var uppercasePattern = /[A-Z]/;
 var lowercasePattern = /[a-z]/;
 var numberPattern = /[0-9]/;

 if (!uppercasePattern.test(passwordInput.value)) {
   passwordInput.classList.add("is-invalid");
   passwordError.innerText = "يجب أن تحتوي كلمة المرور على حرف كبير";
   passwordError.style.float = "right";
   passwordError.style.paddingBottom = "8px";
   event.preventDefault();
 } else if (!lowercasePattern.test(passwordInput.value)) {
   passwordInput.classList.add("is-invalid");
   passwordError.innerText = "يجب أن تحتوي كلمة المرور على حرف صغير";
   passwordError.style.float = "right";
   passwordError.style.paddingBottom = "8px";
   event.preventDefault();
 } else if (!numberPattern.test(passwordInput.value)) {
   passwordInput.classList.add("is-invalid");
   passwordError.innerText = "يجب أن تحتوي كلمة المرور على رقم";
   passwordError.style.float = "right";
   passwordError.style.paddingBottom = "8px";
   event.preventDefault();
 } else if (passwordInput.value.length < 8) {
   passwordInput.classList.add("is-invalid");
   passwordError.innerText = "يجب أن لا يقل طول كلمة المرور عن 8";
   passwordError.style.float = "right";
   passwordError.style.paddingBottom = "8px";
   event.preventDefault();
 } else {
   passwordInput.classList.remove("is-invalid");
   passwordError.innerText = "";
 }
}
});
