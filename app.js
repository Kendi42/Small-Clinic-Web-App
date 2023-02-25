const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const { readFileSync, writeFileSync } = require("fs");
const bodyParser = require("body-parser");
const urlEncoder = bodyParser.urlencoded({ extended: true });
const path = require("path");
const uuid = require('uuid').v4

/* ------  Reading from JSON files ----------*/
const userJSON = "Users.json";
const patientJSON = "Patients.json";

let rawUsers = readFileSync(userJSON);
let Users = JSON.parse(rawUsers);

let rawPatients = readFileSync(patientJSON);
let Patients = JSON.parse(rawPatients);

/*---- Initializing App and PORT ----*/
const app = express();
const PORT = 5000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(urlEncoder)

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

app.get("/signin", (req, res) => {
	res.render("login");
});


// const checkAuthenticated = (req, res, next) => {
// 	if (req.session && req.session.user) {
// 		// User is authenticated, allow access to the requested route.
// 		return next();
// 	} else {
// 		// User is not authenticated, redirect to login page.
// 		res.redirect("/");
// 	}
// };

app.post("/user", (req, res) => {

  for (let i = 0; i < Users.length; i++) {
  if ((req.body.username == Users[i].username) && (req.body.password == Users[i].password)) {
    
    session = req.session;
    session.userid = Users[i].username;
    console.log(req.session);
    console.log(Users[i].role)
    if (Users[i].role === 'Receptionist'){
      const user = Users.find((user) => user.username === Users[i].username);
			console.log("Specific User information", user);
			const todaysDate = new Date().toDateString();
			console.log("Todays Date", todaysDate);
			console.log("Patient information", Patients);
			return res.render("reception", { todaysDate, Patients });
      
    }
    else if (Users[i].role === 'Doctor') {
      const user = Users.find((user) => user.username === Users[i].username);
			console.log("Specific User information", user);
			const todaysDate = new Date().toDateString();
			console.log("Todays Date", todaysDate);
			console.log("Patient information", Patients);
			return res.render("doctor", { user, todaysDate, Patients });
    }
    
  } 
}

app.get("/user", checkAuthenticated, (req, res) => {
	// This route is only accessible to authenticated users.
	res.send("You are authenticated!");
});

return res.send("Invalid username or password");
});

/*-------- Adding Patient ----------*/

// app.get("/reception", (req, res) => {
// 	res.send(Patients);
// });

// app.post('/patientrecs', urlEncoder, (req,res) => {
//   const patientID = "1";
//   const recordID = uuid();
//   const dateCreated = new Date().toDateString();
//   const newRecord = req.body;
//   console.log("Medical record", newRecord);
//   console.log("Patients", Patients);

//   // find the patient with the matching ID
//   const patient = Patients.find(patient => patient.patientID === patientID);
//   console.log("Patient constant", Patients.find(patient => patient.patientID === patientID));

//   // Adding in the record id and date 
//   const completerecord = { id: recordID, date: dateCreated, ...newRecord};


//   // add the new medical record to the patient's "medicalRecords" array
//   patient.medicalRecords.push(completerecord);
//   console.log("After Record has been added", patient);
//   writeFileSync(patientJSON, JSON.stringify(Patients,null,2));

//   // Getting all the patient medical records to update the display on the screen
//   const medicalRecords = patient.medicalRecords;
//   console.log("Medical Records", medicalRecords); 
//   return res.render('reception', { medicalRecords });
// })

app.post("/patients", urlEncoder, (req, res) => {
	const patientID = uuid()
	const checkupDate = new Date().toDateString()
	const newRecord = req.body

	const completeRecord = {patientID: patientID, date: checkupDate, ...newRecord}


	Patients.push(completeRecord);
	writeFileSync(patientJSON, JSON.stringify(Patients, null, 2));


	return res.render('reception', {Patients})

});


// /* --------- Deleting Medical records --------*/
// app.delete("/patients/:id", (req, res) => {
// 	const patientID = "1";
// 	const patient = Patients.find((patient) => patient.patientID === patientID);
// 	const patientIndex = Patients.findIndex(
// 		(patient) => patient.patientID === patientID
// 	);
// 	const { id } = req.params;
// 	const recordIndex = Patients[patientIndex].findIndex(
// 		(record) => record.id === id
// 	);

// 	if (recordIndex !== -1) {
// 		Patients[patientIndex].splice(recordIndex, 1);
// 		writeFileSync(patientJSON, JSON.stringify(Patients, null, 2));
// 		let medicalRecords = patient.medicalRecords.filter(
// 			(record) => record.id !== id
// 		);
// 		return res.render("patient", { patient, medicalRecords });
// 	}
// });

app.delete("/patients/:id", (req, res) => {
	const { id } = req.params;
	const patientIndex = Patients.findIndex(
		(patient) => patient.patientID === id
	);

	if (patientIndex !== -1) {
		Patients.splice(patientIndex, 1);
		writeFileSync(patientJSON, JSON.stringify(Patients, null, 2));
		return res.send("Patient deleted successfully.");
	} else {
		return res.status(404).send("Patient not found.");
	}
});

/*-------------Editing-----------------*/
app.post("/patients/:patientID", (req, res) => {
	console.log("Inside update post method");
	const { patientID } = req.params;
	console.log("Patient ID", patientID);

	const { updatedName, updatedAge, updatedSex, updatedBloodType } = req.body;
	console.log(
		"Updated Information",
		updatedName,
		updatedAge,
		updatedSex, 
    updatedBloodType
	);

	const patient = Patients.find((patient) => patient.patientID === patientID);
	const patientIndex = Patients.findIndex(
		(patient) => patient.patientID === patientID
	);
	console.log("Patient Index", patientIndex);

	if (patientIndex !== -1) {
		Patients[patientIndex].patientName = updatedName;
		Patients[patientIndex].patientAge =
			updatedAge;
		Patients[patientIndex].sex =
			updatedSex;
		console.log(Patients);
		writeFileSync(patientJSON, JSON.stringify(Patients, null, 2));
		console.log("Record Updated");
		const patient = patient;
		console.log("Updated Patient", patient);
		return res.render("patient", { patient });
	}
});



/*-----------Logging Out-------*/

app.use((req, res, next) => {
	res.header("Cache-Control", "no-cache, private, no-store, must-revalidate");
	res.header("Expires", "-1");
	res.header("Pragma", "no-cache");
	next();
});


app.get("/logout", (req, res, next) => {
	req.session.destroy();
	res.redirect("/");
});



app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
