$(document).ready(function() {
  $('form').submit(function(e) {
    var array = $(this).serializeArray()
    for (var i=0; i<array.length; i++)
      if (array[i].value.trim().length === 0) {
	alert('Please fill both inputs before sending')
	return e.preventDefault()
      }
  })
})
