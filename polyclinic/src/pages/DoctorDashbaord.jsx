import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [activePage, setActivePage] = useState("get_users_by_doctor");
  const [medications, setMedications] = useState([]);
  const [getMedicalCondition, setMedicalCondition] = useState([]);
  const [medicationDosages, setMedicationDosages] = useState({});

  const medicationOptions = medications.map((med) => ({
    label: `${med.name} - ${med.description} - $${med.price}`,
    value: med.medication_id, // Use medication_id as the unique value
  }));

  const medicationConditionOptions = getMedicalCondition.map((med) => ({
    label: `${med.name} - ${med.description} `,
    value: med.condition_id, // Use medication_id as the unique value
  }));

  const [appointments, setAppointments] = useState([]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddMedicationForm, setShowAddMedicationForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [formData, setFormData] = useState({
    remark: "",
    severity: "",
    condition: "",
    medication: "",
    price: 20,
  });

  // State for the editable fields in the appointment form
  const [editFormData, setEditFormData] = useState({
    severity: "",
    medication: [], // For multiple medications
    medicalCondition: [], // For multiple conditions
  });
  const medicalConditionsOptions = [
    { label: "Diabetes", value: "Diabetes" },
    { label: "Hypertension", value: "Hypertension" },
    { label: "Asthma", value: "Asthma" },
    { label: "Cholesterol", value: "Cholesterol" },
  ];

  const [doctor_id_ID, setdoctor_id] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const doctor_id = localStorage.getItem("doctor_id");
    setdoctor_id(doctor_id);
  }, []);

  const handleGetAppointments = () => {
    console.log(doctor_id_ID)
    // Define the API endpoint with user_id and role_id
    const apiUrl = `/api/appointment/${doctor_id_ID}/`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fetching appointments failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Appointments fetched:", data.message.appointments);

        // Update appointments state with fetched data
        setAppointments(data.message.appointments);
      })
      .catch((error) => {
        console.error("Fetching appointments failed:", error);
      });
  };

  const handleGetMedication = () => {
    const apiUrl = `/api/medication`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fetching medication failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("medication fetched:", data.message);
        // Map the fetched data to match the expected format
        const formattedMedications = data.message.map((med) => ({
          medication_id: med.medication_id,
          name: med.name,
          description: med.description,
          price: parseFloat(med.price).toFixed(2), // Ensure price is a string in 2 decimal places
        }));
        setMedications(formattedMedications);
      })
      .catch((error) => {
        console.error("Fetching medication failed:", error);
      });
  };


  const handleGetMedicationCondition = () => {
    const apiUrl = `/api/medical_condition/${3}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fetching medication failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("setMedicalCondition fetched:", data.message);

        const formattedMedications = data.message.map((med) => ({
          condition_id: med.condition_id,
          name: med.name,
          description: med.description,
        }));
        setMedicalCondition(formattedMedications)
      })
      .catch((error) => {
        console.error("Fetching medication failed:", error);
      });
  };

  useEffect(() => {
    console.log("doctor_id_ID:", doctor_id_ID);
    if (doctor_id_ID) {
      handleGetAppointments();
      handleGetMedication();
      handleGetMedicationCondition();
    }
  }, [doctor_id_ID]);

  const handleRemoveMedication = (medId) => {
    setMedications((meds) => meds.filter((med) => med.id !== medId));
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditing(false);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditing(true);

    // Update form data with patient_id and doctor_id
    setEditFormData({
      ...editFormData,
      patient_id: appointment.patient_id,  // Assuming patient_id is part of the appointment data
      doctor_id: doctor_id_ID,  // Assuming doctor_id is available in state
      appointment_id: appointment.appointmentId,
      severity: "",  // Reset severity, or set any initial value
      medication: []  // Reset medication selection, or set it based on the appointment if available
    });
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsEditing(false);
    setShowAddMedicationForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewMedicationChange = (e) => {
    const { name, value } = e.target;
    setNewMedication((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDosageChange = (medicationId, dosage) => {
    setMedicationDosages((prevDosages) => ({
      ...prevDosages,
      [medicationId]: dosage,
    }));
  };


  const handleConfirmSession = () => {
    alert(`Session confirmed with details: ${JSON.stringify(formData)}`);
    setSelectedAppointment(null);
  };

  const handleConfirmEdit = () => {
    const diagnosisInfo = {
      patient_id: selectedAppointment.patient_id,  // Assuming patient_id is available from selectedAppointment
      diagnosis_description: editFormData.diagnosis_description || "",  // Diagnosis description entered by the user
      doctor_id: doctor_id_ID,  // Assuming doctor_id is available in state
      severity: editFormData.severity || "",  // Severity selected by the user
      appointment_id: selectedAppointment.appointment_id,
    };

    // Format medication_info new version
    const medicationInfo = editFormData.medication.map((med) => {
      const selectedMedication = medications.find(m => m.medication_id === med.value); // Find medication by id
      return {
        patient_id: selectedAppointment.patient_id,  // Assuming patient_id is available from selectedAppointment
        medication_id: med.value,  // medication_id from the selected medication
        doctor_id: doctor_id_ID,  // Assuming doctor_id is available in state
        dosage: medicationDosages[med.value]?.dosage || "",  // Dosage for this medication
        frequency: medicationDosages[med.value]?.frequency || "",  // Frequency for this medication
        duration: medicationDosages[med.value]?.duration || "",  // Duration for this medication
        price: selectedMedication?.price || "",  // Add the price from the selected medication
      };
    });


    // old version
    // const medicationInfo = editFormData.medication.map((med) => ({
    //   patient_id: selectedAppointment.patient_id,  // Assuming patient_id is available from selectedAppointment
    //   medication_id: med.value,  // medication_id from the selected medication
    //   doctor_id: doctor_id_ID,  // Assuming doctor_id is available in state
    //   dosage: medicationDosages[med.value]?.dosage || "",  // Dosage for this medication
    //   frequency: medicationDosages[med.value]?.frequency || "",  // Frequency for this medication
    //   duration: medicationDosages[med.value]?.duration || ""  // Duration for this medication
    // }));
    
    

    // Combine the data into the final structure
    const formattedData = {
      diagnosis_info: diagnosisInfo,
      medication_info: medicationInfo,
      role: 1  // Assuming role is always 1, as per your example
    };

    // Log the formatted data for debugging purposes
    console.log("Formatted Data:", JSON.stringify(formattedData, null, 2));

    const apiUrl = `/api/diagnosis`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),  // Pass the formatted data in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Submitting diagnosis failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Diagnosis submitted:", data.message);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error submitting diagnosis:", error);
      });


  };


  const handleAddMedication = () => {
    setShowAddMedicationForm(true);
  };

  const handleNewMedicationSubmit = () => {
    if (
      newMedication.name &&
      newMedication.description &&
      newMedication.price
    ) {
      setMedications([
        ...medications,
        { ...newMedication, id: medications.length + 1 },
      ]);
      setShowAddMedicationForm(false);
      setNewMedication({ name: "", description: "", price: "" });
    } else {
      alert("Please fill all fields!");
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "get_users_by_doctor":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Patients
            </h2>
            <p className="mt-4 text-gray-600">
              List of your patients will be shown here.
            </p>
          </div>
        );
      case "get_appointment":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Appointments
            </h2>
            <table className="mt-4 min-w-full bg-white shadow-md rounded-lg p-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Patient Name</th>
                  <th className="border px-4 py-2 text-left">age</th>
                  <th className="border px-4 py-2 text-left">date</th>
                  <th className="border px-4 py-2 text-left">time</th>
                  <th className="border px-4 py-2 text-left">status</th>
                  <th className="border px-4 py-2 text-left">type</th>
                  <th className="border px-4 py-2 text-left">patient_id</th>

                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td className="border px-4 py-2">{appointment.appointment_id}</td>
                    <td className="border px-4 py-2">{appointment.patient_first_name + " " + appointment.patient_last_name}</td>

                    <td className="border px-4 py-2">{appointment.age}</td>
                    <td className="border px-4 py-2">{appointment.date}</td>
                    <td className="border px-4 py-2">{appointment.time}</td>
                    <td className="border px-4 py-2">{appointment.status}</td>
                    <td className="border px-4 py-2">{appointment.type}</td>
                    <td className="border px-4 py-2">{appointment.patient_id}</td>

                    <td className="border px-4 py-2">
                      {/* Conditional button based on status */}
                      {appointment.status === "pending" ? (
                        <button
                          onClick={() => handleEditAppointment(appointment)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleViewAppointment(appointment)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "view_medication":
        return (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Medications
              </h2>
              <button
                onClick={handleAddMedication}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                + Add Medication
              </button>
            </div>
            <table className="mt-4 min-w-full bg-white shadow-md rounded-lg p-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">
                    Medication Name
                  </th>
                  <th className="border px-4 py-2 text-left">
                    More Description
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col h-screen">
        {/* Sidebar Header */}
        <div className="p-4 text-lg font-semibold text-white">
          Welcome, Doctor Dashboard
          <p className="text-sm text-gray-400">Have a great day!</p>
        </div>
        {/* Navigation Menu */}
        <nav className="mt-4 flex flex-col space-y-1">
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === "get_appointment" ? "bg-gray-800" : ""
              }`}
            onClick={() => setActivePage("get_appointment")}
          >
            Appointments
          </a>
          {/* <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${
              activePage === "view_medication" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActivePage("view_medication")}
          >
            View Medications
          </a> */}
        </nav>
        {/* Sidebar Footer */}
        <div className="mt-auto p-4">
          <button
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            onClick={() => {
              // Perform any logout logic
              localStorage.clear();

              // Redirect to the login page
              navigate("/login");
            }}
          >
            Log Out
          </button>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 h-screen">
        {/* Page Content */}
        <main className="flex-grow p-6">{renderContent()}</main>
      </div>

      {/* Add Medication Modal */}
      {showAddMedicationForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add New Medication</h3>
            <div className="mb-2">
              <label className="block text-sm font-medium">
                Medication Name
              </label>
              <input
                type="text"
                name="name"
                value={newMedication.name}
                onChange={handleNewMedicationChange}
                className="mt-1 p-2 border rounded w-full bg-white text-black"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={newMedication.description}
                onChange={handleNewMedicationChange}
                className="mt-1 p-2 border rounded w-full bg-white text-black"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Price ($)</label>
              <input
                type="number"
                name="price"
                value={newMedication.price}
                onChange={handleNewMedicationChange}
                className="mt-1 p-2 border rounded w-full bg-white text-black"
              />
            </div>
            <div className="flex mt-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleNewMedicationSubmit}
              >
                Submit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details or Edit Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Add Diagnosis" : "Appointment Details"}
            </h3>
            {!isEditing ? (
              <>
                <p>
                  <strong>Appointment ID:</strong>{" "}
                  {selectedAppointment.appointmentId}
                </p>
                <p>
                  <strong>Patient Name:</strong>{" "}
                  {selectedAppointment.patientName}
                </p>
                <p>
                  <strong>Doctor Name:</strong> {selectedAppointment.doctorName}
                </p>
                <p>
                  <strong>Date:</strong> {selectedAppointment.date}
                </p>
                <p>
                  <strong>Time:</strong> {selectedAppointment.time}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAppointment.status}
                </p>
                <p>
                  <strong>Type:</strong> {selectedAppointment.type}
                </p>




                <button
                  className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </>
            ) : (
              <div>
                <div className="mb-2">

                  <p>
                    <strong>patient_id :</strong> {editFormData.patient_id}
                  </p>

                  <p>
                    <strong>docotr_id :</strong> {editFormData.doctor_id_ID}
                  </p>


                  <label className="block text-sm font-medium">Severity</label>
                  <select
                    name="severity"
                    value={editFormData.severity}
                    onChange={handleFormChange}
                    className="mt-1 p-2 border rounded w-full bg-white text-black"
                  >
                    <option value="">Select Severity</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>


                <div className="mb-2">
                  <label className="block text-sm font-medium">Medication</label>
                  <MultiSelect
                    options={medicationOptions}
                    value={editFormData.medication}
                    onChange={(selectedOptions) => {
                      setEditFormData((prevData) => ({
                        ...prevData,
                        medication: selectedOptions,
                      }));
                    }}
                    labelledBy="Select Medication"
                  />

                  {/* Render dosage, frequency, and duration input fields for each selected medication */}
                  {editFormData.medication.map((med) => (
                    <div key={med.value} className="mt-2">
                      <label className="block text-sm font-medium">
                        Dosage, Frequency, and Duration for {med.label}
                      </label>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Dosage input */}
                        <input
                          type="text"
                          className="p-2 border rounded w-full bg-white text-black"
                          value={medicationDosages[med.value]?.dosage || ''}
                          onChange={(e) =>
                            handleDosageChange(med.value, {
                              ...medicationDosages[med.value],
                              dosage: e.target.value,
                            })
                          }
                          placeholder="Enter dosage"
                        />

                        {/* Frequency input */}
                        <input
                          type="number"
                          className="p-2 border rounded w-full bg-white text-black"
                          value={medicationDosages[med.value]?.frequency || ''}
                          onChange={(e) =>
                            handleDosageChange(med.value, {
                              ...medicationDosages[med.value],
                              frequency: e.target.value,
                            })
                          }
                          placeholder="Frequency"
                        />

                        {/* Duration input */}
                        <input
                          type="number"
                          className="p-2 border rounded w-full bg-white text-black"
                          value={medicationDosages[med.value]?.duration || ''}
                          onChange={(e) =>
                            handleDosageChange(med.value, {
                              ...medicationDosages[med.value],
                              duration: e.target.value,
                            })
                          }
                          placeholder="Duration (days)"
                        />
                      </div>
                    </div>
                  ))}
                </div>


                <div className="mb-2">
                  <label className="block text-sm font-medium">
                    Medical Condition
                  </label>
                  <MultiSelect
                    options={medicationConditionOptions}
                    value={editFormData.medicalCondition}
                    onChange={(selectedOptions) =>
                      setEditFormData((prevData) => ({
                        ...prevData,
                        medicalCondition: selectedOptions,
                      }))
                    }
                    labelledBy="Select Conditions"
                  />
                </div>

                {/* New input field for Diagnosis Description */}
                <div className="mb-2">
                  <label className="block text-sm font-medium">
                    Diagnosis Description
                  </label>
                  <textarea
                    name="diagnosis_description"
                    value={editFormData.diagnosis_description || ''}
                    onChange={handleFormChange}
                    className="mt-1 p-2 border rounded w-full bg-white text-black"
                    placeholder="Enter detailed diagnosis description"
                  />
                </div>


                <div className="flex mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={handleConfirmEdit}
                  >
                    Submit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
