
// buttons parts
const nextButton = document.querySelector('.btn-next');
const prevButton = document.querySelector('.btn-prev');
const submitButton = document.querySelector('.btn-submit');
const pressButton = document.querySelector('.btn-press');
const steps = document.querySelectorAll('.step');
const form_steps = document.querySelectorAll('.form-step');
const errorMessage = document.getElementById('error-message'); // Get the error message div
let active = 1;

// Add validation function
function validateStep(step) {
    const currentFields = form_steps[step - 1].querySelectorAll('input, select');
    let isValid = true;
    currentFields.forEach(field => {
        if (field.value === "") {
            field.style.border = "2px solid red"; // Highlight the field in red if not filled
            isValid = false;
        } else {
            field.style.border = ""; // Reset border if the field is filled
        }
    });
    return isValid;
}

nextButton.addEventListener('click', () => {
    errorMessage.style.display = 'none'; // Hide any previous error messages
    if (validateStep(active)) { // Only move to the next step if validation passes
        active++;
        if (active > steps.length) {
            active = steps.length;
        }
        updateProgress();
    } else {
        errorMessage.textContent = 'لا تترك حقول فارغة';
        errorMessage.style.display = 'block'; // Show the error message in red
    }
});

prevButton.addEventListener('click', () => {
    errorMessage.style.display = 'none'; // Hide error message when going back
    active--;
    if (active < 1) {
        active = 1;
    }
    updateProgress();
});
// Add event listener for the press button
pressButton.addEventListener('click', () => {
    const form = document.querySelector('form'); // Get the form element

    // Validate form before submitting (optional, based on existing validation rules)
    const requiredFields = form.querySelectorAll('input, select');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            field.style.border = '2px solid red';
            isValid = false;
        } else {
            field.style.border = '';
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
        return;
    }

    // Submit the form
    form.action = "/submitForm";  // Make sure the form action matches your route
    form.method = "POST";  // Ensure the method is POST
    form.submit();  // This will trigger the form submission

    // Show the report container
    showReport();

    // Remove 'active' from all items
    li_items.forEach(function(li) {
        li.classList.remove("active");
    });

    // Find the item and set it as active
    const reportItem = Array.from(li_items).find(item => {
        const itemText = item.querySelector(".item").textContent.trim(); 
        return itemText === "التقارير"; 
    });
    
    if (reportItem) {
        reportItem.classList.add("active");  // Add 'active' class to item
    }
});


submitButton.addEventListener('click', () => {
    errorMessage.style.display = 'none'; // Hide any previous error messages
    if (validateStep(active)) { // Ensure final validation before submitting
        active++;
        if (active > steps.length) {
            active = steps.length;
        }
        event.preventDefault(); // منع الإرسال الفوري للنموذج
        validateSiteData(); // التحقق من البيانات
        updateProgress();
    } else {
        errorMessage.textContent = 'لا تترك حقول فارغة ';
        errorMessage.style.display = 'block'; // Show the error message in red
    }
});


const updateProgress = () => { 
    console.log('step length =>' + steps.length);
    console.log('active =>' + active);

    // toggle active class for steps
    steps.forEach((step, i) => {
        if (i == active - 1) {
            step.classList.add('active');
            form_steps[i].classList.add('active');
            console.log('i =>'+ i);
        }
        else {
            step.classList.remove('active');
            form_steps[i].classList.remove('active');
        }
    });
    //enable disable next and prev and submit and press buttons
    if (active === 1) {
        prevButton.disabled = true;
    }
    else if (active === steps.length) {
        nextButton.disabled = true;
    }
    else {
        submitButton.disabled = false;
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
}

//Result..
function validateSiteData() {
    const activityType = document.getElementById("activityType").value;
    const partOfLargerBuilding = document.getElementById("partOfLargerBuilding").value;
    const buildingType = document.getElementById("buildingType").value;
    const parkingSpaces = parseInt(document.getElementById("parkingSpaces").value, 10);
    const onCommercialStreet = document.getElementById("onCommercialStreet").value;
    const logisticsArea = document.getElementById("logisticsArea").value;
    const warehouseArea = document.getElementById("warehouseArea").value;

    const errors = [];

    // تحقق من الشروط المختلفة
    if (activityType === "openStore") {
        if (parkingSpaces < 1) {
            errors.push(".يجب توفير موقف سيارات واحد على الأقل للمتجر المفتوح");
        }
        if (onCommercialStreet === "no") {
            errors.push(".يجب أن يكون الموقع على شارع تجاري أو بمنطقة تجارية");
        }
    }

    if (activityType === "closedStoreCity") {
        if (partOfLargerBuilding === "yes") {
            if (buildingType !== "commercial" && buildingType !== "mixed") {
                errors.push(".إذا كان النشاط ضمن جزء من مبنى، يجب أن يكون ضمن المباني التجارية أو المختلطة");
            }
            if (onCommercialStreet === "no") {
                errors.push(".يجب أن يكون الموقع على الشوارع التجارية");
            }
        } else {
            if (parkingSpaces < Math.ceil(100 / 70)) {
                errors.push(".يجب توفير موقف سيارات واحد لكل 70 م2 للمتجر المغلق المستقل");
            }
        }
    }

    if (activityType === "closedStoreOutsideCity") {
        if (partOfLargerBuilding === "yes" || partOfLargerBuilding === "no") {
            if (logisticsArea === "no" && warehouseArea === "no") {
                errors.push(".يجب أن يكون الموقع في منطقة الخدمات اللوجستية أو منطقة المستودعات");
            }
        }
    }

    // عرض النتيجة
    const resultContainer = document.getElementById("resultMessage");
    resultContainer.className = ''; // إعادة تعيين أي نمط سابق
    if (errors.length > 0) {
        resultContainer.innerHTML = `<p>:موقعك لا يتوافق مع الاشتراطات. الأسباب</p><ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>`;
        resultContainer.classList.add('error');
    } else {
        resultContainer.innerHTML = "<p>.موقعك يتوافق مع الاشتراطات. يمكنك المتابعة</p>";
        resultContainer.classList.add('success');
    }
}