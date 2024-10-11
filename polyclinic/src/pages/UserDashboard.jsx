import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Appointments from "./Appointments";

const UserDashboard = () => {
  const [activePage, setActivePage] = useState("profile"); // Set default active tab to "profile"
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  // State to hold localStorage data
  const [userId, setUserId] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  const [role_id_fk_ID, setrole_id_fk] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Loading state for logout
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null); // Store the appointment being edited

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
  const [billing, setBilling] = useState([]);

  const joinAppointmentsAndBilling = () => {
    const joinedData = appointments.map((appointment) => {
      const matchingBilling = billing.find(
        (bill) => bill.appointment_id_fk === appointment.appointment_id
      );
      return {
        ...appointment,
        billing: matchingBilling || {}, // If no matching billing record, return empty object
      };
    });
  
    console.log("Joined Appointments and Billing Data:", joinedData);
    return joinedData;
  };
  

  const handleGetProfile = () => {
    fetch(`/api/appointment`, {
      method: "PUT",
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


  const handleGetBilling = (user_id) => {
    fetch(`/api/billing/${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Billing failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Billing successful:", data.message.current);
        setBilling(data.message.current);
        joinAppointmentsAndBilling();

      })
      .catch((error) => {
        console.error("Billing failed:", error);
      });



      
  }

  const renderProfileContent = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>
        <p>User profile information goes here.</p>
        {/* Example profile detail */}
        <div>
          <strong>Email:</strong> user@example.com
          <br />
          <strong>User ID:</strong> {userId}
          <br />
          <strong>Role ID:</strong> {role_id_fk_ID}
        </div>
      </div>
    );
  };


  
  const renderBillingContent = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Billing</h2>
        <p>Billing information goes here.</p>
    
      </div>
    );
  };
  const handleBookAppointment = (event) => {
    event.preventDefault(); // Prevent default form submit action

    const formData = {
      appointment_info: {
        date: appointmentDate,
        time: appointmentTime,
        type: visitType,
        patient_id: patientId,
      },
    };

    const requestMethod = isEditing ? "PUT" : "POST"; // Use PUT for updates and POST for new
    const url = isEditing
      ? `/api/appointment/${editingAppointment.patient_id_fk}/${editingAppointment.appointment_id}`
      : `/api/appointment`;

    fetch(url, {
      method: requestMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(isEditing ? "Update failed" : "Booking failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          isEditing ? "Update successful" : "Booking successful",
          data
        );
        setShowBookingForm(false); // Close the form on success
        setIsEditing(false); // Reset editing mode
        setEditingAppointment(null); // Reset editing appointment

        if (patientId && role_id_fk_ID) {
          handleGetAppointments(); // Refresh the appointment list
        }
      })
      .catch((error) => {
        console.error(isEditing ? "Update failed" : "Booking failed", error);
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
  };

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
    if (userId && Appointments) {
      handleGetBilling(userId);
    }

  }, [userId]); 


  useEffect(() => {
    console.log("patientId:", patientId, "role_id_fk_ID:", role_id_fk_ID);
    if (patientId && role_id_fk_ID) {
      handleGetAppointments();
    }
  }, [patientId, role_id_fk_ID]); 

  const openModal = (appointment) => {
    setSelectedAppointment(appointment); // This sets the entire appointment object
    setShowModal(true);
  };

  const handleLogout = () => {
    setLoading(true); // Start loading
    setTimeout(() => {
      // Simulate logout process
      localStorage.clear();
      setLoading(false); // Stop loading
      navigate("/login"); // Redirect to login page after logout
    }, 2000); // Simulate 2 seconds delay for logout
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
    setIsEditing(false); // Reset editing state
    setEditingAppointment(null); // Clear editing appointment data

    // Reset form fields
    setVisitType("");
    setAppointmentDate("");
    setAppointmentTime("");
  };

  const openUpdateModal = (appointment) => {
    setIsEditing(true); // We're editing an appointment
    setEditingAppointment(appointment); // Store the appointment being edited

    // Pre-fill the form with the appointment data
    setVisitType(appointment.type);
    setAppointmentDate(appointment.date);
    setAppointmentTime(appointment.time);
    setSelectedAppointment(appointment);

    setShowBookingForm(true); // Show the form modal
  };

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return renderProfileContent();
        case "billing":
          return renderBillingContent();
      case "appointments":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Appointments
            </h2>
            {appointments.length === 0 ? (
              <p>No appointments available.</p> // Show this when there are no appointments
            ) : (
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">
                      Appointment ID
                    </th>
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Time</th>
                    <th className="border px-4 py-2 text-left">Doctor ID</th>
                    <th className="border px-4 py-2 text-left">Patient ID</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">Type</th>
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
                              Waiting for doctor to complete
                            </span>
                            <button
                              onClick={() => openUpdateModal(appointment)}
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 ml-2 rounded"
                            >
                              Update
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAppointment(
                                  appointment.patient_id_fk,
                                  appointment.appointment_id
                                )
                              }
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 ml-2 rounded"
                            >
                              Delete
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
            )}
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
          Welcome, User Dashboard
          <p className="text-sm text-gray-400">Have a great day!</p>
        </div>
        {/* Navigation Menu */}
        <nav className="mt-4 flex flex-col space-y-1">
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md text-white ${
              activePage === "profile" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActivePage("profile")}
          >
            Profile
          </a>
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
            onClick={handleLogout}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-dashed rounded-full animate-spin mx-auto"></div>
            ) : (
              "Log Out"
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 h-screen">
        {/* Page Content */}
        <main className="flex-grow p-6">
          <div className="flex justify-between items-center mb-4">
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
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Field</th>
                  <th className="border px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Appointment ID</td>
                  <td className="border px-4 py-2">
                    {selectedAppointment.appointment_id}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Date</td>
                  <td className="border px-4 py-2">
                    {selectedAppointment.date}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Time</td>
                  <td className="border px-4 py-2">
                    {selectedAppointment.time}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Doctor ID</td>
                  <td className="border px-4 py-2">
                    {selectedAppointment.doctor_id_fk}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Patient ID</td>
                  <td className="border px-4 py-2">
                    {selectedAppointment.patient_id_fk}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Status</td>
                  <td className="border px-4 py-2">
                    {selectedAppointment.status}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Type</td>
                  <td className="border px-4 py-2">
                    {selectedAppointment.type}
                  </td>
                </tr>
              </tbody>
            </table>
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
                  {isEditing ? "Update Appointment" : "Book Appointment"}
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
