import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("view_user");
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const [noData, setNoData] = useState(false); // Track no data state

  const getuser = () => {
    const role_id = localStorage.getItem("role_id_fk");
    fetch(`/api/users/${role_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        const usersData = data.message.users;
        setUsers(usersData);
        setNoData(usersData.length === 0); // Set no data state
      })
      .catch((error) => {
        console.error("Request failed:", error);
      })
      .finally(() => setLoading(false)); // Stop loading when request completes
  };

  useEffect(() => {
    getuser();
  }, []);



  // if doctor, 
  // {
  //   "user_info" : {
  //     "role_id": 1,
  //     "username": "BOBON",
  //     "password_hash": "12345",
  //     "email": "mama123@gmail.com",
  //     "first_name": "Bobon",
  //     "last_name": "Dobo"
  //   }
  //     ,
  //   "role_info" : {
  //       "phone_number": "89482312",
  //       "specialty": "Woman"
  //     }
  // }
  // '''

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      // Prepare user_info using values from newUser
      const user_info = {
        role_id: 1,
        username: newUser.username,
        password_hash: newUser.password,
        email: newUser.email,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
      };

      const role_info = {
        phone_number: newUser.phoneNumber,
        address: newUser.address,
        specialty: newUser.specialty
      };

      // Submit the data
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_info, role_info }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Registration failed");
          return response.json();
        })
        .then((data) => {
          console.log("Registration successful:", data.message.status);
          if (data.message.status === "success") {
            alert("User added to the database");
          } else if (
            data.message.message ===
            "User already exists with this username or email."
          ) {
            alert("Account already registered. Please go to the login page.");
          }
        })
        .catch((error) => {
          console.error("Registration failed:", error);
        });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    alert(`User with ID ${userId} deleted.`);
  };

  const handleAddUser = () => setShowAddUserModal(true);

  const handleAddUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCloseModal = () => setShowAddUserModal(false);

  // Function to map role_id to role name
  const getRoleName = (role_id) => {
    switch (role_id) {
      case "1":
        return "Doctor";
      case "2":
        return "Patient";
      case "3":
        return "Admin";
      default:
        return "Unknown";
    }
  };

  const renderContent = () => {
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
        <div className="relative min-w-full bg-white shadow-md rounded-lg overflow-hidden min-h-[200px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : noData ? (
            <div className="p-4 text-center text-gray-500">
              No data available.
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">Username</th>
                  <th className="border px-4 py-2 text-left">Role</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.username}</td>
                    <td className="border px-4 py-2">
                      {getRoleName(user.role_id)}
                    </td>
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
          )}
        </div>
      </div>
    );
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
          <button
            className={`px-4 py-2 hover:bg-gray-800 rounded-md text-white ${
              activePage === "view_user" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActivePage("view_user")}
          >
            View User
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto p-4">
          <button
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            onClick={() => alert("Logging out...")}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen p-6">{renderContent()}</main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="mb-2">
                <label className="block text-sm font-medium">Role id : 1</label>

                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleAddUserInputChange}
                  className="mt-1 p-2 border rounded w-full bg-white text-black"
                />

                <label className="block text-sm font-medium">Password</label>
                <input
                  type="text"
                  name="password"
                  value={newUser.password}
                  onChange={handleAddUserInputChange}
                  className="mt-1 p-2 border rounded w-full bg-white text-black"
                />

                <label className="block text-sm font-medium">Email</label>
                <input
                  type="text"
                  name="email"
                  value={newUser.email}
                  onChange={handleAddUserInputChange}
                  className="mt-1 p-2 border rounded w-full bg-white text-black"
                />

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
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleAddUserInputChange}
                  className="mt-1 p-2 border rounded w-full bg-white text-black"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={newUser.phoneNumber}
                  onChange={handleAddUserInputChange}
                  className="mt-1 p-2 border rounded w-full bg-white text-black"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  value={newUser.specialty}
                  onChange={handleAddUserInputChange}
                  className="mt-1 p-2 border rounded w-full bg-white text-black"
                />
              </div>

              <div className="flex mt-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
