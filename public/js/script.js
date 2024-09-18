                  // JavaScript to display validation errors
                  const idInput = document.querySelector('input[name="idNumber"]');
                  const passwordInput = document.querySelector('input[name="password"]');
                  const idError = document.getElementById('idError');
                  const passwordError = document.getElementById('passwordError');
                
                 // Check for errors when form submits
                document.querySelector('form').addEventListener('submit', function(event) {
                  if (!idInput.value || isNaN(idInput.value)) {
                    idInput.classList.add('is-invalid');
                    idError.innerText = "رقم الهوية / الإقامة مطلوب ويجب أن يكون رقماً.";
                    idError.style.float = "right";
                    event.preventDefault();
                  } else if (idInput.value.length !== 10) {
                    idInput.classList.add('is-invalid');
                    idError.innerText = "رقم الهوية / الإقامة يجب أن يتكون من 10 أرقام.";
                    idError.style.float = "right";
                    event.preventDefault();
                  } else {
                    idInput.classList.remove('is-invalid');
                    idError.innerText = "";
                  }

                  if (!passwordInput.value) {
                    passwordInput.classList.add('is-invalid');
                    passwordError.innerText = "كلمة المرور مطلوبة.";
                    passwordError.style.float = "right";
                    event.preventDefault();
                  } else {
                    passwordInput.classList.remove('is-invalid');
                    passwordError.innerText = "";
                  }
                });