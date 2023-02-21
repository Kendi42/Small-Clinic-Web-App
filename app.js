const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const { readFileSync, writeFileSync } = require('fs')
const bodyParser = require('body-parser')
const urlEncoder = bodyParser.urlencoded({extended:true})
const jsonParser = bodyParser.json()
const path = require('path')
const uuid = require('uuid').v4;


/* ------  Reading from JSON files ----------*/
const userJSON = 'Users.json'
const patientJSON = 'Patients.json'


let rawUsers = readFileSync(userJSON)
let Users = JSON.parse(rawUsers)

let rawPatients = readFileSync(patientJSON)
let Patients = JSON.parse(rawPatients)

const app = express();
const PORT = 4000;

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());


// a variable to save a session
var session;

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;


//username and password
const myusername = "user1";
const mypassword = "mypassword";

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

/* --------- Logging In --------*/

app.get("/", (req, res) => {
  session = req.session;
  if (session.userid) {
    res.send("Welcome User <a href='/logout'>click to logout</a>");
  } else res.render("index", { root: __dirname });  // Changed this to index cause thats the first page
});

app.get('/login', (req, res) => {
  res.render('login')
})

app.post("/user", (req, res) => {

  for (let i = 0; i < Users.length; i++) {
  if ((req.body.username == Users[i].username) && (req.body.password == Users[i].password)) {
    session = req.session;
    session.userid = Users[i].username;
    console.log(req.session);
    console.log(Users[i].username)
    return res.render('patient')
  } 
}
return res.send("Invalid username or password");
});

/*-------- Adding Medical Records----------*/
/*--Shoudl I have the same or different JSON files?---*/
/*--How do you only write to specific parts of a JSON file? ---*/

/* Patients.medicalRecords.push({
  id: '4',
  description: 'New medical record for John Doe'
});*/


/*
app.post('/patients/:id/medicalRecords', urlEncoder, (req, res) => {
  const patientId = req.params.id; // get the patient ID from the request parameters
  const newRecord = req.body; // get the new medical record data from the request body
  
  // read the current patient data from the JSON file
  const patientsData = JSON.parse(readFileSync(patientsJSON));
  
  // find the patient with the matching ID
  const patient = patientsData.find(patient => patient.id === patientId);
  
  // add the new medical record to the patient's "medicalRecords" array
  patient.medicalRecords.push(newRecord);
  
  // write the updated patient data back to the JSON file
  writeFileSync(patientsJSON, JSON.stringify(patientsData, null, 2));
  
  res.end();
}); */


app.post('/medrecs', urlEncoder, (req,res) => {
  const patientID = "1";
  const recordID = uuid();
  const dateCreated = new Date().toDateString();
  const newRecord = req.body;
  console.log("Medical record", newRecord);
  console.log("Patients", Patients);

  // find the patient with the matching ID
  const patient = Patients.find(patient => patient.patientID === patientID);
  console.log("Patient constant", Patients.find(patient => patient.patientID === patientID));

  // Adding in the record id and date 
  const completerecord = { id: recordID, date: dateCreated, ...newRecord};


  // add the new medical record to the patient's "medicalRecords" array
  patient.medicalRecords.push(completerecord);
  console.log("After Record has been added", patient);

  writeFileSync(patientJSON, JSON.stringify(Patients,null,2))
  return res.render('patient');
})


app.post('/patients', urlEncoder, (req,res) => {
  Patients.push(req.body)
  writeFileSync(patientJSON, JSON.stringify(Patients,null,2))
  res.end()
})


app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});





app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));

