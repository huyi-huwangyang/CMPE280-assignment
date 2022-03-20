//get the report
fetchReport = function()
{
  $.ajax({
    url: "http://localhost:3000/report",
    type: "GET",
    dataType: 'json',
    success: function(result) {
      var data = result.report;
      console.log(data)
      for (var i = 0; i < data.length; ++i) {
        var firstname = data[i]['firstname'];
        var lastname = data[i]['lastname'];
        var age = data[i]['age'];
        var gender = data[i]['gender'];
        var image = data[i]['image'];
        var medications = data[i]['medications'];
        var notes = data[i]['notes'];
        document.getElementById("report").innerHTML +=
        "<tr><td>" + firstname+" "+lastname + "</td><td>" + age
        + "</td><td>" + gender + "</td><td><img src=\"" + image + "\" width=40px>"
        + "</td><td>" + medications + "</td><td>" + notes + "</td><tr>";
      }
    }
  });
};


//page onload function
$(function(){

  fetchReport();

  //patient form post
  $('form#patient_form').submit(function(event){
    event.preventDefault();
    var data = {
      firstname : $("#firstname").val(),
      lastname : $("#lastname").val(),
      gender : $("#gender").val(),
      age : $("#age").val(),
      other : $("#other").val(),
      image : $("#image").val()
    }
    $.ajax({
      url: "http://localhost:3000/patient",
      type: "POST",
      data: {
        postData: data
      },
      dataType: 'json',
      success: function(result) {
        var return_id = result.id;
        var message = document.getElementById('message');
        message.textContent = "Your ID is "+return_id+ ". You can use this ID to insert health vitals information";
        alert('Patient record ' + return_id + ' saved!');
      },
      error: function() {
        alert('The patient record could not be saved.'); 
      }
    });
  });

  //health form post
  $('form#health_form').submit(function(event){
    event.preventDefault();
    var data = {
      patientid : $("#patientid").val(),
      height : $("#height").val(),
      weight : $("#weight").val(),
      temperature : $("#temperature").val(),
      pulse : $("#pulse").val(),
      bp : $("#bp").val(),
      medications : $("#medications").val(),
      notes : $("#notes").val()
    }
    $.ajax({
      url: "http://localhost:3000/health",
      type: "POST",
      data: {
        postData: data
      },
      dataType: 'json',
      success: function(result) {
        var return_id = result.id;
        alert('Health Vitals record ' + return_id + ' for patient id ' + data.patientid + ' saved!');
      },
      error: function() {
        alert('The health vitals record could not be saved.'); 
      }
    });
  });

});