import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('insert_user');

  const renderContent = () => {
    switch (activePage) {
      case 'insert_user':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">insert_user</h2>
            <p className="mt-4 text-gray-600">insert_user</p>
          </div>
        );
      case 'update_user':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">update_user</h2>
            <p className="mt-4 text-gray-600">update_user</p>
          </div>
        );
        case 'delete_user':
          return (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">delete_user</h2>
              <p className="mt-4 text-gray-600">delete_user</p>
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
            onClick={() => setActivePage('insert_user')}
          >
            create_user_doc_paitent
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Appointments' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('update_user')}
          >
            update_user
          </a>
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Appointments' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('delete_user')}
          >
            delete_user
          </a>

          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Appointments' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('delete_user')}
          >
            get_paitent_bill_medication
          </a>

          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Appointments' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('delete_user')}
          >
            get_docotr_paitent_bill_medication
          </a>

          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md ${activePage === 'Appointments' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('delete_user')}
          >
            set_appoitment_doctor_paitent
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

export default AdminDashboard;
