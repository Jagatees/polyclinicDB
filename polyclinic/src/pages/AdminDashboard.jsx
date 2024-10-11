import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("view_user");
  const [users, setUsers] = useState([]);
  const [usersAll, setUsersAll] = useState([]);
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
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState(null);
  const [role_id_fk_ID, setrole_id_fk] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [userId, setUserId] = useState(null); // Add this line to define userId state

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
        console.log("user data ", usersData);
        setUsersAll(usersData);
        // setUsers(usersData);
        // setNoData(usersData.length === 0); // Set no data state
      })
      .catch((error) => {
        console.error("Request failed:", error);
      })
      .finally(() => setLoading(false)); // Stop loading when request completes
  };

  useEffect(() => {
    getuser();
  }, []);

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
        specialty: newUser.specialty,
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
            // Reset form fields
            setNewUser({
              username: "",
              email: "",
              password: "",
              role: "",
              firstName: "",
              lastName: "",
              phoneNumber: "",
              specialty: "",
            });
            // Go back to view user page
            setActivePage("view_user");
            // Refresh the user list
            getuser();
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

  const handleDeleteUser = async (userId) => {
    try {
      fetch(`/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Deletion failed");
          return response.json();
        })
        .then((data) => {
          console.log("Deletion successful:", data.message.status);
          getuser();
        })
        .catch((error) => {
          console.error("Deletion failed:", error);
        });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleAddUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const renderContent = () => {
    if (activePage === "view_user") {
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">View Users</h2>
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
                    <th className="border px-4 py-2 text-left">Role ID</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersAll.map((user) => (
                    <tr key={user.user_id}>
                      <td className="border px-4 py-2">{user.username}</td>
                      <td className="border px-4 py-2">{user.role_id}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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
    } else if (activePage === "add_user") {
      return (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Add New User</h3>
          <form onSubmit={handleCreateUser}>
            <div className="mb-2">
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
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleAddUserInputChange}
                className="mt-1 p-2 border rounded w-full bg-white text-black"
              />

              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
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
                onClick={() => setActivePage("view_user")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
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
          <button
            className={`px-4 py-2 hover:bg-gray-800 rounded-md text-white ${
              activePage === "view_user" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActivePage("view_user")}
          >
            View User
          </button>
          <button
            className={`px-4 py-2 hover:bg-gray-800 rounded-md text-white ${
              activePage === "add_user" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActivePage("add_user")}
          >
            Add User
          </button>
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
      <main className="flex-1 h-screen p-6">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
