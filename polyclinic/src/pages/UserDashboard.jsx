import React, { useState } from "react";

const UserDashboard = () => {
  const [activePage, setActivePage] = useState("appointments");
  const [billingTab, setBillingTab] = useState("current");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctorName: "Dr. Smith",
      date: "2024-09-30",
      time: "10:00 AM",
      status: "Pending",
      diagnosis: "Under review",
      consultationType: "General Checkup",
      medications: [ // Add medications as an array of objects
        {
          name: "N/A",
          dosage: "N/A",
          frequency: "N/A"
        }
      ],
    },
    {
      id: 2,
      doctorName: "Dr. Doe",
      date: "2024-10-01",
      time: "02:00 PM",
      status: "Confirmed",
      diagnosis: "Flu",
      consultationType: "Specialist Consultation",
      medications: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "Twice a day"
        }
      ],
    },
  ]);
  
  

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
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setBillingTab("current")}
            className={`px-4 py-2 rounded ${
              billingTab === "current"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setBillingTab("history")}
            className={`px-4 py-2 rounded ${
              billingTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            History
          </button>
        </div>
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
                    <th className="border px-4 py-2 text-left">Date</th>
                    <th className="border px-4 py-2 text-left">Time</th>
                    <th className="border px-4 py-2 text-left">Doctor Name</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">Type of Consultation</th>
                    <th className="border px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="border px-4 py-2">{appointment.date}</td>
                      <td className="border px-4 py-2">{appointment.time}</td>
                      <td className="border px-4 py-2">{appointment.doctorName}</td>
                      <td className="border px-4 py-2">{appointment.status}</td>
                      <td className="border px-4 py-2">{appointment.consultationType}</td>
                      <td className="border px-4 py-2">
                        {appointment.status === "Pending" ? (
                          <span className="text-yellow-600">
                            Waiting for doctor to confirm
                          </span>
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
      <p><strong>Doctor:</strong> {selectedAppointment.doctorName}</p>
      <p><strong>Date:</strong> {selectedAppointment.date}</p>
      <p><strong>Time:</strong> {selectedAppointment.time}</p>
      <p><strong>Status:</strong> {selectedAppointment.status}</p>
      <p><strong>Diagnosis:</strong> {selectedAppointment.diagnosis}</p>
      {/* Medications Table */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Medications</h3>
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Dosage</th>
              <th className="border px-4 py-2">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {selectedAppointment.medications.map((med, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{med.name}</td>
                <td className="border px-4 py-2">{med.dosage}</td>
                <td className="border px-4 py-2">{med.frequency}</td>
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
            <form>
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">Describe Your Problem</label>
                <textarea
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border rounded shadow bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">Type of Visit</label>
                <select className="w-full px-3 py-2 border rounded shadow bg-white text-black">
                  <option>Select a visit type</option>
                  <option>Medical Consulation</option>
                  <option>Checkup</option>
                  <option>Vaccination</option>

                  {/* Add your options here */}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">Select Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded shadow bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-2">Select Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded shadow bg-white text-black"
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
