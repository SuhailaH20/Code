 // Retrieve requests from localStorage
 const requests = JSON.parse(localStorage.getItem('requests')) || [];
 const reportTable = document.getElementById('reportTable');
 const reportMessage = document.getElementById('reportMessage'); // Get the message div

 if (requests.length === 0) {
     reportMessage.textContent = "لا يوجد طلبات لعرض التقرير."; // Set the message text
     reportMessage.style.display = 'block'; // Show the message
 } else {
     reportTable.style.display = 'table'; // Show the table if there are requests
     // Display requests in the table
     requests.forEach((request, index) => {
         const row = document.createElement('tr');
         row.innerHTML = `
             <td>${index + 1}</td>
             <td class="${request.success ? 'success' : 'Reasons'}">
                 ${request.success ? 'مقبول' : 'مرفوض'}
             </td>
             <td>
                 <span class="collapse-btn">عرض الأسباب</span>
                 <div class="collapse-content">
                     <ul>${request.reasons.map(reason => `<li>${reason}</li>`).join('')}</ul>
                 </div>
             </td>
         `;
         reportTable.querySelector('tbody').appendChild(row);
     });

     // Implement collapsible feature
     const collapseBtns = document.querySelectorAll('.collapse-btn');
     collapseBtns.forEach(btn => {
         btn.addEventListener('click', () => {
             btn.classList.toggle('active');
             const content = btn.nextElementSibling;
             content.style.display = content.style.display === 'block' ? 'none' : 'block';
         });
     });
 }