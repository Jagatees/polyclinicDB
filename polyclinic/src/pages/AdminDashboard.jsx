import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('view_user');
  const [users, setUsers] = useState([
    { id: 1, firstName: 'John', role: 'Admin' },
    { id: 2, firstName: 'Jane', role: 'Doctor' },
    { id: 3, firstName: 'Alice', role: 'Patient' },
  ]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', role: '' });


    event.preventDefault();
    fetch("/api/get-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "emily.clark@example.com",
        password: "123",
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Login successful:", data);
    })
    .catch((error) => {
      console.error("Login failed:", error);
    });

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    alert(`User with ID ${userId} deleted.`);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleAddUserSubmit = () => {
    if (newUser.firstName && newUser.role) {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
      setShowAddUserModal(false);
      setNewUser({ firstName: '', role: '' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleAddUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCloseModal = () => {
    setShowAddUserModal(false);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'view_user':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">View Users</h2>
              <button
                onClick={handleAddUser}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Add User
              </button>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">First Name</th>
                  <th className="border px-4 py-2 text-left">Role</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.firstName}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
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
          Welcome, Admin Dashboard
          <p className="text-sm text-gray-400">Have a great day!</p>
        </div>
        {/* Navigation Menu */}
        <nav className="mt-4 flex flex-col space-y-1">
          <a
            href="#"
            className={`px-4 py-2 hover:bg-gray-800 rounded-md text-white ${activePage === 'view_user' ? 'bg-gray-800' : ''}`}
            onClick={() => setActivePage('view_user')}
          >
            View User
          </a>
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto p-4">
          <button
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            onClick={() => {
              alert('Logging out...');
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
          {renderContent()}
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <div className="mb-2">
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newUser.firstName}
                onChange={handleAddUserInputChange}
                className="mt-1 p-2 border rounded w-full bg-white text-black"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleAddUserInputChange}
                className="mt-1 p-2 border rounded w-full bg-white text-black"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
              </select>
            </div>
            <div className="flex mt-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleAddUserSubmit}
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
    </div>
  );
};

export default AdminDashboard;
