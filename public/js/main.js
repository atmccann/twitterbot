var response;

$(document).ready(function() {
  $.getJSON('/test', function(data) {
    response = data
    console.log(data)
    // response.test.statuses.forEach(function(status) {
    //   $('body').append(status.text)
    //   $('body').append('<br>')
    //   $('body').append('<br>')
    // })
  });
});

