
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
    if (validateStep(active)) {  // Validate the current step before proceeding
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
    errorMessage.style.display = 'none';  // Hide error message when going back
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
        updateProgress();
    } else {
        errorMessage.textContent = 'لا تترك حقول فارغة ';
        errorMessage.style.display = 'block'; // Show the error message in red
    }
});


const updateProgress = () => {
    steps.forEach((step, i) => {
        if (i == active - 1) {
            step.classList.add('active');
            form_steps[i].classList.add('active');
            form_steps[i].style.display = 'block';  // Show the active step
        } else {
            step.classList.remove('active');
            form_steps[i].classList.remove('active');
            form_steps[i].style.display = 'none';  // Hide non-active steps
        }
    });

    if (active === 3) {
        validateSiteData(); // التحقق من البيانات
    }
    if (active === 1) {
        prevButton.disabled = true; 
        nextButton.disabled = false; 
        submitButton.style.display = 'none'; 
    } else if (active === steps.length) {
        nextButton.style.display = 'none'; 
        submitButton.style.display = 'inline-block';
    } else {
        prevButton.disabled = false;
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }
};


//Result..
function validateSiteData() {
    const activityType = document.getElementById("activityType").value;
    const partOfLargerBuilding = document.getElementById("partOfLargerBuilding").value;
    const buildingType = document.getElementById("buildingType").value;
    const parkingSpaces = parseInt(document.getElementById("parkingSpaces").value, 10);
    const onCommercialStreet = document.getElementById("onCommercialStreet").value;
    const logisticsArea = document.getElementById("logisticsArea").value;
    const warehouseArea = document.getElementById("warehouseArea").value;

    const Reasons = [];
    const successMessages = ["موقعك يتناسب مع الاشتراطات"]; // الرسالة الناجحة

  // تحقق من الشروط المختلفة
  if (activityType === "closedStoreCity") {
    if (partOfLargerBuilding === "yes") {
        if (buildingType !== "mixed") {
            Reasons.push(".(تجاري سكني) إذا كان النشاط ضمن جزء من مبنى، يجب أن يكون ضمن المباني التجارية والمختلطة");
        }
        if (onCommercialStreet === "no") {
            Reasons.push(".يجب أن يكون النشاط على الشوارع التجارية");
        }
    } else {
        if (parkingSpaces < Math.ceil(100 / 70)) {
            Reasons.push(".يجب توفير موقف سيارات واحد لكل 70 م2 للمتجر المغلق المستقل");
        }
    }
}

if (activityType === "closedStoreOutsideCity") {
    if (partOfLargerBuilding === "yes") {
        if (logisticsArea === "no" && warehouseArea === "no") {
            Reasons.push(".يجب أن يكون الموقع في منطقة الخدمات اللوجستية أو منطقة المستودعات");
        }
        if (onCommercialStreet === "no") {
            Reasons.push(".يجب أن يكون النشاط على الشوارع التجارية");
        }
    } else {
        if (logisticsArea === "no" && warehouseArea === "no") {
            Reasons.push(".يجب أن يكون الموقع في منطقة الخدمات اللوجستية أو منطقة المستودعات");
        }
        if (parkingSpaces < Math.ceil(100 / 70)) {
            Reasons.push(".يجب توفير موقف سيارات واحد لكل 70 م2 للمتجر المغلق المستقل");
        }
    }
}
    // عرض النتيجة
    const resultContainer = document.getElementById("resultMessage");
    resultContainer.className = ''; // إعادة تعيين أي نمط سابق

    // تخزين الطلبات في localStorage
    const currentRequests = JSON.parse(localStorage.getItem('requests')) || [];
    const newRequest = {
        reasons: Reasons,
        createdAt: new Date().toISOString(), // تخزين تاريخ الإنشاء
        success: Reasons.length === 0, // تحديد النجاح أو الفشل
        successMessages: successMessages // إضافة الرسالة الناجحة
    };
    currentRequests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(currentRequests));

    if (Reasons.length > 0) {
        resultContainer.innerHTML = `<p>موقعك لا يتوافق مع الاشتراطات لمعرفة الأسباب:</p>`;
        resultContainer.classList.add('Reasons');

        // إظهار زر "الذهاب إلى صفحة التقرير" وإخفاء زر "التالي"
        document.getElementById("reportButton").style.display = "block"; // إظهار الزر
        document.querySelector(".btn-next").style.display = "none"; // إخفاء زر "التالي"
    } else {
        resultContainer.innerHTML = `<p>${successMessages.join(', ')}</p>`; // عرض الرسالة الناجحة
        resultContainer.classList.add('success');

        // إظهار زر "التالي" وإخفاء زر "الذهاب إلى صفحة التقرير"
        document.querySelector(".btn-next").style.display = "block"; // إظهار زر "التالي"
        document.getElementById("reportButton").style.display = "none"; // إخفاء الزر
    }
}
