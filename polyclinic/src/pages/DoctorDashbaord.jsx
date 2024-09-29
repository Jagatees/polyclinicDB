import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";

const DoctorDashboard = () => {
  const [activePage, setActivePage] = useState("get_users_by_doctor");
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Amoxicillin",
      description: "Antibiotic for treating infections",
      price: 25,
    },
    {
      id: 2,
      name: "Lisinopril",
      description: "Medication for high blood pressure",
      price: 10,
    },
    {
      id: 3,
      name: "Metformin",
      description: "Diabetes management medication",
      price: 15,
    },
    {
      id: 4,
      name: "Simvastatin",
      description: "Used to lower cholesterol",
      price: 20,
    },
    {
      id: 5,
      name: "Albuterol",
      description: "Inhaler for asthma symptoms",
      price: 18,
    },
  ]);
  const medicationOptions = medications.map(med => ({
    label: `${med.name} - $${med.price}`,
    value: med.name
  }));
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      appointmentId: "APPT001",
      patientName: "John Doe",
      doctorName: "Dr. Smith",
      date: "2024-09-28",
      time: "10:00 AM",
      status: "Completed",
      type: "Check-up",
    },
    {
      id: 2,
      appointmentId: "APPT002",
      patientName: "Jane Smith",
      doctorName: "Dr. Brown",
      date: "2024-09-29",
      time: "02:00 PM",
      status: "Pending",
      type: "Consultation",
    },
  ]);

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
    diagnosisDate: "",
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

  const handleConfirmSession = () => {
    alert(`Session confirmed with details: ${JSON.stringify(formData)}`);
    setSelectedAppointment(null);
  };

  const handleConfirmEdit = () => {
    alert(`Appointment updated with details: ${JSON.stringify(editFormData)}`);
    handleCloseModal();
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
                  <th className="border px-4 py-2 text-left">Appointment ID</th>
                  <th className="border px-4 py-2 text-left">Patient Name</th>
                  <th className="border px-4 py-2 text-left">Doctor Name</th>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Time</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Type</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="border px-4 py-2">
                      {appointment.appointmentId}
                    </td>
                    <td className="border px-4 py-2">
                      {appointment.patientName}
                    </td>
                    <td className="border px-4 py-2">
                      {appointment.doctorName}
                    </td>
                    <td className="border px-4 py-2">{appointment.date}</td>
                    <td className="border px-4 py-2">{appointment.time}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={`font-bold ${
                          appointment.status === "Pending"
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2">{appointment.type}</td>
                    <td className="border px-4 py-2">
                      {appointment.status === "Completed" ? (
                        <button
                          onClick={() => handleViewAppointment(appointment)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          View
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditAppointment(appointment)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Edit
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
                  <th className="border px-4 py-2 text-left">Description</th>
                  <th className="border px-4 py-2 text-left">Price ($)</th>
                  <th className="border px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr key={med.id}>
                    <td className="border px-4 py-2">{med.name}</td>
                    <td className="border px-4 py-2">{med.description}</td>
                    <td className="border px-4 py-2">{med.price}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleRemoveMedication(med.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
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
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${
              activePage === "get_appointment" ? "bg-gray-800" : ""
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
              alert("Logging out...");
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
    onChange={(selectedOptions) => setEditFormData((prevData) => ({
      ...prevData,
      medication: selectedOptions
    }))}
    labelledBy="Select Medication"
  />
</div>

                <div className="mb-2">
                  <label className="block text-sm font-medium">
                    Medical Condition
                  </label>
                  <MultiSelect
                    options={medicalConditionsOptions}
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
