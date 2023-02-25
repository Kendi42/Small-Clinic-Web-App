const server = "http://localhost:4000";

let patientName;
let patientAge;
let prescription;









function deletePatient(patientID) {
	fetch(`/patients/${patientID}`, {
		method: "DELETE",
	})
		.then((response) => {
			//Remove the table from the DOM 
			const row = document.getElementById(`patient-${patientID}`)
			if (row) {
				row.remove();
			}
		})
		.catch((error) => {
			console.error("Error deleting patient:", error);
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





