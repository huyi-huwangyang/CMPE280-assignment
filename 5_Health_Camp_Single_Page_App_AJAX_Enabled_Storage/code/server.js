const express = require("express")
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Setting path for public directory
const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));

//config mysql database
const mysql = require('mysql');
const db = mysql.createPool({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b8c802ea12feb6',
    password: '7b967db7',
    database: 'heroku_ecf8d539eb4a82b'
});

db.getConnection((err) => {
    if(err){
      throw err;
    } else{
      console.log("connect to db");
    }
    //TEST
    // db.query('SELECT * FROM patient', (err, results)=>{
    //   if (err) throw err;
    //   console.log(results);
    // })
});

// Handling request of patient form post
app.post("/patient", (req, res) => {
  //console.log(req.body.postData);
  db.query("INSERT INTO patient (firstname, lastname, gender, age, other, image) VALUES (?, ?, ?, ?, ?, ?)", 
    [req.body.postData.firstname, req.body.postData.lastname, req.body.postData.gender, req.body.postData.age, req.body.postData.other, req.body.postData.image],
    (err, result)=>{
      if (err) {
        res.json({msg: 'error'});
      } 
      if (result) {
        //console.log(result.insertId);
        res.json({msg: 'success', id: result.insertId});
      }
    })
})

// Handling request of health form post
app.post("/health", (req, res) => {
  //console.log(req.body.postData);
  db.query("INSERT INTO health (patient_id, height, weight, bodytemperature, pulserate, bp, medications, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
    [req.body.postData.patientid, req.body.postData.height, req.body.postData.weight, req.body.postData.temperature, req.body.postData.pulse, req.body.postData.bp, req.body.postData.medications, req.body.postData.notes],
    (err, result)=>{
      if (err) {
        res.json({msg: 'error'});
      } 
      if (result) {
        //console.log(result.insertId);
        res.json({msg: 'success', id: result.insertId});
      }
    })
})

// Handling request of report table get
app.get("/report", (req, res) => {
  db.query("SELECT p.firstname, p.lastname, p.age, p.gender, p.image, h.medications, h.notes "+
  "FROM patient p LEFT JOIN health h ON p.idpatient=h.patient_id", [],
  (err, result)=>{
    if (err) {
      res.json({msg: 'error'});
    } 
    if (result) {
      //console.log(result);
      res.json({msg: 'success', report: result});
    }
  })
})

// Server Setup
app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
