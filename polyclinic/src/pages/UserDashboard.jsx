import React, { useState } from 'react';

const UserDashboard = () => {
  const [activePage, setActivePage] = useState('get_users_by_doctor');

  const renderContent = () => {
    switch (activePage) {
      case 'get_appointments':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">get_appointments</h2>
            <p className="mt-4 text-gray-600">get_appointments</p>
          </div>
        );
      case 'get_billing':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">get_billing</h2>
            <p className="mt-4 text-gray-600">get_billing</p>
          </div>
        );
        case 'get_medication':
          return (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">get_medication</h2>
              <p className="mt-4 text-gray-600">get_medication</p>
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
            onClick={() => setActivePage('get_appointments')}
          >
            get_appointments
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Appointments' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('get_billing')}
          >
            get_billing
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Appointments' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('get_medication')}
          >
            get_medication
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

export default UserDashboard;
