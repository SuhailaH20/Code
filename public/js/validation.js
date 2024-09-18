 // JavaScript to display validation errors
 const form = document.querySelector('form');
 const nameInput = document.querySelector('input[name="name"]');
 const idInput = document.querySelector('input[name="idNumber"]');
 const phoneNumberInput = document.querySelector('input[name="phoneNumber"]');
 const emailInput = document.querySelector('input[name="email"]');
 const passwordInput = document.querySelector('input[name="password"]');
 const nameError = document.getElementById('nameError');
 const idError = document.getElementById('idError');
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
 var namePattern = /^[a-zA-Z]+\s[a-zA-Z]+\s[a-zA-Z]+$/;
 if (!namePattern.test(nameInput.value)) {
   nameInput.classList.add("is-invalid");
   nameError.innerText = "الرجاء ادخال اسم ثلاثي صحيح";
   nameError.style.float = "right";
   nameError.style.paddingBottom = "6px";
   event.preventDefault();
 } else {
   nameInput.classList.remove("is-invalid");
   nameError.innerText = "";
 }}

   if (!idInput.value || isNaN(idInput.value)) {
       idInput.classList.add('is-invalid');
       idError.innerText = "الرجاء ادخال رقم الهوية / الإقامة ويجب أن يكون رقماً";
       idError.style.float = "right";
       idError.style.paddingBottom = "10px";
       event.preventDefault();
   }else if (idInput.value.length !== 10) {
       idInput.classList.add('is-invalid');
       idError.innerText ="رقم الهوية / الإقامة يجب أن يتكون من 10 أرقام";
       idError.style.float = "right";
       idError.style.paddingBottom = "10px";
       event.preventDefault();
   } else {
         idInput.classList.remove('is-invalid');
         idError.innerText = ""
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
