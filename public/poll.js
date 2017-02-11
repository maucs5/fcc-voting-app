var generate = function(data) {
  var keys = Object.keys(data);
  var labels = [];
  var values = [];
  for (var i=0; i<keys.length; i++) {
    labels.push(keys[i]);
    values.push(data[keys[i]]);
  }
  return {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
	{
	  data: values,
	  backgroundColor: [
            "red", "green", "blue", "yellow", "pink",
	    "white", "black", "magenta", "orange", "grey"
	  ]}
      ]
    }
  }
};

var create = function(data) {
  var ctx = document.getElementById("my-chart");
  var myChart = new Chart(ctx, generate(data));
};

$(document).ready(function() {
  url = window.location.href + '/chart';
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE)
      create(JSON.parse(httpRequest.responseText));
  };
  httpRequest.open('GET', url);
  httpRequest.send();

  $('#poll-select').on('change', function() {
    $('#poll-custom').toggle(document.getElementById('poll-select-custom').selected);
  });

  // document.getElementById('poll-form').setAttribute('action', window.location.href);

  $('#poll-form').submit(function(event) {
    event.preventDefault();
    if ($('#poll-select').val() === null) {
      return alert('Please choose an option');
    };
    if ($('#poll-select option:selected').attr('id') === 'poll-select-custom') {
      if (document.getElementById('poll-custom').value.trim().length === 0) {
	return alert('Please name the option');
      }
    };
    $.post({
      url: window.location.href,
      data: $(this).serialize()
    }).done(function(msg) {
      location.reload(true);
    });
  });

  $('#poll-delete').click(function(event) {
    if (window.confirm("really?")) {
      $.ajax({
	url: window.location.href,
	method: 'DELETE'
      }).done(function(msg) {
	alert(msg);
	window.location.href = '/';
      })
    }
  });
});
