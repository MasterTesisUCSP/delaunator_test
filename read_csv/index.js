$(document).ready(function() {

	const points1 = [ [21,272], [104,257]];
	console.log("points=",points1);

    $.ajax({
        type: "GET",
        url: "buho_9.vtk.mNodes",
        dataType: "text",
        success: function(data) {
 			convertCSV_Array(data);       	
    
        }
     });

});


function convertCSV_Array(data){


	var points = $.csv2Array(data, {
      onParseValue: $.csv.hooks.castToScalar
    });
	console.log("result=",points);
	var html = generateTable(points);
	  $('#csv').empty();
	  $('#csv').html(html);
}


// build HTML table data from an array (one or two dimensional)
function generateTable(data) {
  var html = '';

  if(typeof(data[0]) === 'undefined') {
    return null;
  }

  if(data[0].constructor === String) {
  	console.log("String");
    html += '<tr>\r\n';
    for(var item in data) {
      html += '<td>' + data[item] + '</td>\r\n';
    }
    html += '</tr>\r\n';
  }

  if(data[0].constructor === Array) {
  	console.log("Array");
    for(var row in data) {
      html += '<tr>\r\n';
      for(var item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n';
      }
      html += '</tr>\r\n';
    }
  }

  if(data[0].constructor === Object) {
  	console.log("Object");
    for(var row in data) {
      html += '<tr>\r\n';
      for(var item in data[row]) {
        html += '<td>' + item + ':' + data[row][item] + '</td>\r\n';
      }
      html += '</tr>\r\n';
    }
  }
  
  return html;
}