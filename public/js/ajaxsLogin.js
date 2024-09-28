$(document).ready(function () {
    function showNotification(message) {
      $('#popupNotification').text(message);
      $('#popupNotification').fadeIn().delay(3000).fadeOut(); // Fade in, delay, and then fade out
    }
  
    $('form').submit(function (event) {
      event.preventDefault(); // Prevent form submission
  
      $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function (response) {
          // Redirect to the main page on successful login
          window.location.href = '/'; 
        },
        error: function (xhr) {
          var errorMessage = xhr.responseJSON ? xhr.responseJSON.error : 'Internal Server Error';
          showNotification(errorMessage); // Display error message as pop-up notification
        }
      }); }); });