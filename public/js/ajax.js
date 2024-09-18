$(document).ready(function () {
    // Function to display pop-up notification
    function showNotification(message) {
      $('#popupNotification').text(message);
      $('#popupNotification').fadeIn().delay(3000).fadeOut(); // Fade in, delay, and then fade out
    }

    // Handle AJAX responses
    $('form').submit(function (event) {
      event.preventDefault(); // Prevent form submission
      $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function (response) {
          if (response.message) {
            showNotification(response.message); // Display message as pop-up notification
          } else {
            window.location.href = '/'; // Redirect to landing page on successful login
          }
        },
        error: function (xhr, status, error) {
          var errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Internal Server Error';
          showNotification(errorMessage); // Display error message as pop-up notification
        }
      });
    });
  });