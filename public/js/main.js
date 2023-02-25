const server = "http://localhost:4000";

async function fetchData() {
	const url = server + "/patients";
	const options = {
		method: "GET",
		headers: {
			'Accept' : "application/json",
		},
	};
	const response = await fetch(url, options);
	const patients = await response.json();
	populateContent(patients);
}

async function addPatient() {
	const url = server + "/patients";
	const patient = { patientName: patientName, patientAge: patientAge, prescription: prescription };
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
	var table = document.getElementById('patientDetailsTable')
	table.innerHTML =
		"<tr><th>Date</th><th>Time(s)</th><th>Distance(m)</th></tr>";

	patients.forEach(patient => {
		let row = document.createElement('tr')
		let dataDate = document.createElement('td')
		let patientName = document.createTextNode(patients.name)
		let patientAge = document.createElement('td')
		let textAge = document.createTextNode(patients.age)
	})
}

// HANDLING THE MEDICAL RECORDS
// Populating the table
function populateRecords(medicalRecords) {
	const tableBody = $('#medical-records-body');
	tableBody.empty(); // Remove all existing rows from the table
  
	medicalRecords.forEach(record => {
	  const newRow = `
		<tr>
		  <td>${record.date}</td>
		  <td>${record.title}</td>
		  <td>
			<button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#edit-record-modal" onclick="editRecord('${record.id}')">
			  Edit
			</button>
			<button type="button" class="btn btn-sm btn-danger" onclick="deleteRecord('${record.id}')">
			  Delete
			</button>
		  </td>
		</tr>
	  `;
	  tableBody.append(newRow); 
	});
  }
//Deleting a Row/ Record
function deleteRecord(patientID, recordID){
	console.log("Record ID from delte", recordID);
	console.log("PatientID from delte", patientID);

	fetch(`/patients/${patientID}/${recordID}`, {
		method: 'DELETE'
	  })
	  .then((response) => {
		console.log("Inside then response");
		// Remove the table row from the DOM
		const row = document.getElementById(`record-${recordID}`);
		if (row) {
			row.remove();
			console.log("Row removed");
		}
	})
	  .catch(error => {
		console.error('Error deleting record:', error);
	  });

}

//Selecting a patient and viewing it
/*function patientPage(patientID){
	console.log("Patient ID", patientID);
	fetch(`/patients/${patientID}`, {
		method: 'POST'
	  })
    .catch(error => {
		console.error('Error', error);
	  });
}*/
