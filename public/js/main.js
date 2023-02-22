const server = "http://localhost:4000";

let patientName;
let patientAge;
let prescription;

async function fetchData() {
	const url = server + "/patients";
	const options = {
		method: "GET",
		headers: {
			'Accept' : "application/json"
		},
	};
	const response = await fetch(url, options);
	const patients = await response.json();
	populateContent(patients);
}

async function addPatient() {
	const url = server + "/patients";
	const patient = {
		patientName: patientName,
		patientAge: patientAge,
		prescription: prescription,
	};
	const options = {
		method: "POST",
		header: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(patient),
	};
	const response = await fetch(url, options);
	fetchData();
}

// Populating The Table

function populateContent(patients) {
	var table = document.getElementById("patientDetailsTable");
	table.innerHTML =
		"<tr><th>Date</th><th>Time(s)</th><th>Distance(m)</th></tr>";

	patients.forEach((patient) => {
		let row = document.createElement("tr");
		let dataDate = document.createElement("td");
		let patientName = document.createTextNode(patients.patientName);
		let patientAge = document.createElement("td");
		let textAge = document.createTextNode(patients.patientAge);
	});
}
