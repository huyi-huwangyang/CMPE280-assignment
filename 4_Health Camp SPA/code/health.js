//database reference
var db = null;

// Creates a connection to the local database
connectToDB = function()
{
  db = window.openDatabase('HealthCampSPA', '1.0', 'CMPE280 HealthCampSPA', 1024*1024*3);//size of the db
};

//create 2 tables
createTable = function()
{
  db.transaction(function(tx){
    tx.executeSql(
      "CREATE TABLE patient (id INTEGER PRIMARY KEY, firstname, lastname, gender, age, other, image)", [],
      function(){ alert('Patient table created successfully!'); },
      //function(tx, error){ alert(error.message); } 
    );
    tx.executeSql(
      "CREATE TABLE healthvitals (patientid, height, weight, bodytemperature, pulserate, bp, medications, notes)", [],
      function(){ alert('Health Vitals table created successfully!'); },
      // function(tx, error){ alert(error.message); } 
    );
  });
};

//Insert record into Table.
insertPatient = function(data)
{
  db.transaction(function(tx){
    tx.executeSql("INSERT INTO patient (firstname, lastname, gender, age, other, image) VALUES (?, ?, ?, ?, ?, ?)", 
                  [data.firstname.val(), data.lastname.val(), data.gender.val(), data.age.val(), data.other.val(), data.image.val()],
      function(tx, result){ 
        var id = result.insertId;
        var message = document.getElementById('message');
        message.textContent = "Your ID is "+id+ ". You can use this ID to insert health vitals information";
        alert('Patient record ' + id + ' saved!');
      },
      function(){ 
        alert('The patient record could not be saved.'); 
      }
    );
  });
};

insertHealth = function(data)
{
  db.transaction(function(tx){
    tx.executeSql("INSERT INTO healthvitals (patientid, height, weight, bodytemperature, pulserate, bp, medications, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                  [data.patientid.val(), data.height.val(), data.weight.val(), data.temperature.val(), data.pulse.val(), data.bp.val(), data.medications.val(), data.notes.val()],
      function(tx, result){ 
        var id = result.insertId;
        alert('Health Vitals record ' + id + ' for patient id ' + data.patientid.val() + ' saved!');
      },
      function(){ 
        alert('The health vitals record could not be saved.'); 
      }
    );
  });
};

//get the report
fetchReport = function()
{
  db.transaction(function(tx) {
    tx.executeSql("SELECT p.firstname, p.lastname, p.age, p.gender, p.image, h.medications, h.notes "+
      "FROM patient p LEFT JOIN healthvitals h ON p.id=h.patientid", [],
      function(SQLTransaction, data){
        for (var i = 0; i < data.rows.length; ++i) {
          var row = data.rows.item(i);
          var firstname = row['firstname'];
          var lastname = row['lastname'];
          var age = row['age'];
          var gender = row['gender'];
          var image = row['image'];
          var medications = row['medications'];
          var notes = row['notes'];
          document.getElementById("report").innerHTML +=
          "<tr><td>" + firstname+" "+lastname + "</td><td>" + age
          + "</td><td>" + gender + "</td><td><img src=\"" + image + "\" width=40px>"
          + "</td><td>" + medications + "</td><td>" + notes + "</td><tr>";
        }
    });
  }); 
};

//page onload function
$(function(){
  connectToDB();
  createTable();
  fetchReport();

  $('form#patient_form').submit(function(event){
    event.preventDefault();
    var data = {
      firstname : $("#firstname"),
      lastname : $("#lastname"),
      gender : $("#gender"),
      age : $("#age"),
      other : $("#other"),
      image : $("#image")
    }
    insertPatient(data);
  });

  $('form#health_form').submit(function(event){
    event.preventDefault();
    var data = {
      patientid : $("#patientid"),
      height : $("#height"),
      weight : $("#weight"),
      temperature : $("#temperature"),
      pulse : $("#pulse"),
      bp : $("#bp"),
      medications : $("#medications"),
      notes : $("#notes")
    }
    insertHealth(data);
  });

});