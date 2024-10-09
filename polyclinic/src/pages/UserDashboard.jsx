import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [activePage, setActivePage] = useState("appointments");
  const [billingTab, setBillingTab] = useState("current");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  // State to hold localStorage data
  const [userId, setUserId] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  const [role_id_fk_ID, setrole_id_fk] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve and set user_id and patient_id from local storage
    const localUserId = localStorage.getItem("user_id");
    const localPatientId = localStorage.getItem("patient_id");
    const role_id_fk = localStorage.getItem("role_id_fk");
    const doctor_id = localStorage.getItem("doctor_id");

    setDoctorId(doctor_id);
    setUserId(localUserId);
    setPatientId(localPatientId);
    setrole_id_fk(role_id_fk);
  }, []);

  // New state variables for form inputs
  const [description, setDescription] = useState("");
  const [visitType, setVisitType] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointments, setAppointments] = useState([]);

  const [billingData, setBillingData] = useState([
    {
      id: 1,
      institution: "National University Polyclinics",
      invoice: "0F24002204",
      amount: 22.45,
      status: "current",
    },
    {
      id: 2,
      institution: "National University Polyclinics",
      invoice: "0F23306097",
      amount: 47.85,
      status: "current",
    },
    {
      id: 3,
      institution: "National University Polyclinics",
      invoice: "0F24567023",
      amount: 0.0,
      status: "history",
    },
  ]);

  const handleBookAppointment = (event) => {
    event.preventDefault(); // Prevent the default form submit action

    // Gathering the data from state
    const formData = {
      appointment_info: {
        date: appointmentDate,
        time: appointmentTime,
        type: visitType,
        patient_id: patientId,
      },
    };

    fetch(`/api/appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Sending the formData as JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Booking failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Booking successful:", data);
        setShowBookingForm(false); // Close the form on success
        if (patientId && role_id_fk_ID) {
          handleGetAppointments();
        }
      })
      .catch((error) => {
        console.error("Booking failed:", error);
      });
  };


  const handleDeleteAppointment = (patient_id, appointment_id) => {
    try {
      fetch(`/api/appointment/${patient_id}/${appointment_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Registration failed");
          return response.json();
        })
        .then((data) => {
          console.log("Deletaion successful:", data.message.status);
          if (patientId && role_id_fk_ID) {
            handleGetAppointments();
          }
        })
        .catch((error) => {
          console.error("Deletaion failed:", error);
        });
    } catch (error) {
      console.error("Validation failed:", error);
    }

    
  }


  const handleGetAppointments = () => {
    fetch(`/api/appointment/${patientId}/${role_id_fk_ID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Booking failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Booking successful:", data.message);
        setAppointments(data.message);
      })
      .catch((error) => {
        console.error("Booking failed:", error);
      });
  };

  useEffect(() => {
    console.log("patientId:", patientId, "role_id_fk_ID:", role_id_fk_ID);
    if (patientId && role_id_fk_ID) {
      handleGetAppointments();
    }
  }, [patientId, role_id_fk_ID]); // Add dependencies to ensure re-render

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const openBookingForm = () => {
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
  };

  const renderBillingContent = () => {
    const filteredBilling = billingData.filter(
      (item) => item.status === billingTab
    );

    return (
      <div>
        <div className="flex space-x-4 mb-4"></div>
        {filteredBilling.map((item) => (
          <div
            key={item.id}
            className="border p-4 mb-2 flex justify-between items-center rounded shadow"
          >
            <div>
              <div className="text-lg font-bold">{item.institution}</div>
              <div className="text-gray-500">Invoice: {item.invoice}</div>
            </div>
            <div
              className={`text-xl font-semibold ${
                item.amount > 0 ? "text-green-600" : "text-gray-600"
              }`}
            >
              S${item.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "appointments":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Appointments
            </h2>
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">appointment_id</th>

                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Time</th>
                  <th className="border px-4 py-2 text-left">doctor_id_fk</th>
                  <th className="border px-4 py-2 text-left">patient_id_fk</th>
                  <th className="border px-4 py-2 text-left">status</th>
                  <th className="border px-4 py-2 text-left">type</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td className="border px-4 py-2">
                      {appointment.appointment_id}
                    </td>

                    <td className="border px-4 py-2">{appointment.date}</td>
                    <td className="border px-4 py-2">{appointment.time}</td>
                    <td className="border px-4 py-2">
                      {appointment.doctor_id_fk}
                    </td>
                    <td className="border px-4 py-2">
                      {appointment.patient_id_fk}
                    </td>
                    <td className="border px-4 py-2">{appointment.status}</td>
                    <td className="border px-4 py-2">{appointment.type}</td>
                    <td className="border px-4 py-2">
                      {appointment.status === "pending" ? (
                        <>
                          <span className="text-yellow-600">
                            Waiting for doctor to confirm
                          </span>
                          <button
                            onClick={() => openUpdateModal(appointment)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 ml-2 rounded"
                          >
                            Update
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAppointment(appointment.patient_id_fk, appointment.appointment_id)
                            }
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 ml-2 rounded"
                          >
                            Delete {appointment.patient_id_fk} {appointment.id}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openModal(appointment)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "billing":
        return renderBillingContent();
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
          Welcome, User Dashboard
          <p className="text-sm text-gray-400">Have a great day!</p>
        </div>
        {/* Navigation Menu */}
        <nav className="mt-4 flex flex-col space-y-1">
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md text-white ${
              activePage === "appointments" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActivePage("appointments")}
          >
            Appointments
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md text-white ${
              activePage === "billing" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActivePage("billing")}
          >
            Billing
          </a>
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
        <main className="flex-grow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activePage === "appointments" ? "Appointments" : "Billing"}
            </h2>
            {activePage === "appointments" && (
              <button
                onClick={openBookingForm}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                + Book Appointment
              </button>
            )}
          </div>
          {renderContent()}
        </main>
      </div>

      {/* Modal for Appointment Details */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
            {/* Medications Table */}
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Medications</h3>
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Dosage</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.appointment_id}>
                      <td className="border px-4 py-2">{appointment.date}</td>
                      <td className="border px-4 py-2">{appointment.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
            <form onSubmit={handleBookAppointment}>
              <div className="mb-4">
                {/* <label className="block text-gray-800 text-sm font-bold mb-2">Describe Your Problem</label> */}
                {/* <textarea
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border rounded shadow bg-white text-black"
                /> */}
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Type of Visit
                </label>
                <select
                  className="w-full px-3 py-2 border rounded shadow bg-white text-black"
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                >
                  <option value="">Select a visit type</option>
                  <option value="Medical Consultation">
                    Medical Consultation
                  </option>
                  <option value="Checkup">Checkup</option>
                  <option value="Vaccination">Vaccination</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded shadow bg-white text-black"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Select Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded shadow bg-white text-black"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeBookingForm}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
