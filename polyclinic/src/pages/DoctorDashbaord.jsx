import React, { useState } from 'react';

const DoctorDashboard = () => {
  const [activePage, setActivePage] = useState('get_users_by_doctor');
  const [medications, setMedications] = useState([
    { id: 1, name: "Amoxicillin", dosage: "500 mg", frequency: "three times a day", purpose: "infection" },
    { id: 2, name: "Lisinopril", dosage: "10 mg", frequency: "daily", purpose: "blood pressure" },
    { id: 3, name: "Metformin", dosage: "500 mg", frequency: "twice a day", purpose: "diabetes" },
    { id: 4, name: "Simvastatin", dosage: "20 mg", frequency: "nightly", purpose: "lower cholesterol" },
    { id: 5, name: "Albuterol", dosage: "Use inhaler", frequency: "as needed", purpose: "asthma symptoms" },
  ]);

  const handleRemoveMedication = (medId) => {
    setMedications(meds => meds.filter(med => med.id !== medId));
  };

  const renderContent = () => {
    switch (activePage) {
      case 'get_users_by_doctor':
        return <div><h2 className="text-2xl font-semibold text-gray-800">Your Patients</h2><p className="mt-4 text-gray-600">List of your patients will be shown here.</p></div>;
      case 'get_appointment':
        return <div><h2 className="text-2xl font-semibold text-gray-800">Appointments</h2><div className="mt-4 bg-white shadow-md rounded-lg p-4"><h3 className="text-lg font-medium">John Doe</h3><p>Date: 2024-09-25</p><p>Status: <span className="text-green-500">Pending</span></p></div></div>;
      case 'get_profile':
        return <div><h2 className="text-2xl font-semibold text-gray-800">Profile</h2><div className="mt-4 bg-white shadow-md rounded-lg p-6"><h3 className="text-lg font-medium">Dr. Jane Smith</h3><p>Specialty: Cardiology</p><p>Email: drsmith@example.com</p><p>Phone: (123) 456-7890</p><p className="mt-2">Dr. Jane Smith is a dedicated cardiologist with over 10 years of experience helping patients manage heart conditions.</p></div></div>;
      case 'view_medication':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Medications</h2>
            <table className="mt-4 min-w-full bg-white shadow-md rounded-lg p-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">Medication Name</th>
                  <th className="border px-4 py-2 text-left">Dosage</th>
                  <th className="border px-4 py-2 text-left">Frequency</th>
                  <th className="border px-4 py-2 text-left">Purpose</th>
                  <th className="border px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr key={med.id}>
                    <td className="border px-4 py-2">{med.name}</td>
                    <td className="border px-4 py-2">{med.dosage}</td>
                    <td className="border px-4 py-2">{med.frequency}</td>
                    <td className="border px-4 py-2">{med.purpose}</td>
                    <td className="border px-4 py-2">
                      <button onClick={() => handleRemoveMedication(med.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
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
          Welcome, Dr. Smith
          <p className="text-sm text-gray-400">Have a great day!</p>
        </div>
        {/* Navigation Menu */}
        <nav className="mt-4 flex flex-col space-y-1">
          <a href="#" className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'get_appointment' ? 'bg-gray-800' : ''}`} onClick={() => setActivePage('get_appointment')}>Get Appointment</a>
          <a href="#" className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'get_profile' ? 'bg-gray-800' : ''}`} onClick={() => setActivePage('get_profile')}>Profile</a>
          <a href="#" className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'view_diagnose' ? 'bg-gray-800' : ''}`} onClick={() => setActivePage('view_diagnose')}>View Diagnoses</a>
          <a href="#" className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'view_medication' ? 'bg-gray-800' : ''}`} onClick={() => setActivePage('view_medication')}>View Medications</a>
        </nav>
        {/* Sidebar Footer */}
        <div className="mt-auto p-4">
          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md" onClick={() => { alert('Logging out...'); }}>Log Out</button>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 h-screen">
        {/* Page Content */}
        <main className="flex-grow p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
