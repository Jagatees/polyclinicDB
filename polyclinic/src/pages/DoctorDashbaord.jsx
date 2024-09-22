import React, { useState } from 'react';

const DoctorDashboard = () => {
  // State to track the selected menu item
  const [activePage, setActivePage] = useState('Dashboard');

  // Function to render different content based on the active page
  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
            <p className="mt-4 text-gray-600">Welcome to your dashboard! Here you can get an overview of your activity.</p>
          </div>
        );
      case 'Appointments':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Manage Appointments</h2>
            <p className="mt-4 text-gray-600">Here you can view, schedule, and manage all your appointments.</p>
          </div>
        );
      case 'Patients':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Patient Records</h2>
            <p className="mt-4 text-gray-600">Access and manage patient records and medical history here.</p>
          </div>
        );
      case 'Messages':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Messages</h2>
            <p className="mt-4 text-gray-600">Check and respond to your messages here.</p>
          </div>
        );
      case 'Settings':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
            <p className="mt-4 text-gray-600">Manage your account and system settings here.</p>
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
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md text-white ${activePage === 'Dashboard' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('Dashboard')}
          >
            Dashboard
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Appointments' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('Appointments')}
          >
            Appointments
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Patients' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('Patients')}
          >
            Patients
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Messages' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('Messages')}
          >
            Messages
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Settings' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('Settings')}
          >
            Settings
          </a>
        </nav>

        {/* Sidebar Footer */}

          {/* Sidebar Footer */}
          <div className="mt-auto p-4">
          <button
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            onClick={() => {
              // Log out logic here
              alert('Logging out...');
            }}
          >
            Log Out
          </button>
        </div>
        
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 h-screen ">
        {/* Page Content */}
        <main className="flex-grow p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
