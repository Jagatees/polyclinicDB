import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../assets/images.jpg';

const Registration = () => {
  const navigate = useNavigate();

  // States to capture user input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = (event) => {
    event.preventDefault();

    // Create the data payload
    const userInfo = {
      firstName,
      lastName,
      username,
      age,
      gender,
      phone,
      address,
      email,
      password
    };

    const roleInfo = { role_id_fk: 1 }; // Set the default role (modify as needed)

    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInfo, // Send the captured user info
        roleInfo, // Send role info if needed
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Registration failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Registration successful:', data);
        navigate('/home'); // Navigate to the home page on success
      })
      .catch((error) => {
        console.error('Registration failed:', error);
      });
  };

  return (
    <div className="h-screen w-screen flex">
      <div
        className="w-1/2 flex flex-col justify-between p-8 text-white"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <div>
          <h1 className="text-4xl font-bold mb-8">Polyclinic Inc</h1>
        </div>
        <div className="mb-8">
          <p className="text-lg italic">"INF2003-Databases-Project-1"</p>
          <p className="mt-4 font-semibold">P2-Group 13</p>
        </div>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-800 p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold text-white mb-6">Create an account</h2>
          <form onSubmit={handleRegistration}>
            {/* First Name Field */}
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm text-gray-400 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name Field */}
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm text-gray-400 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Age Field */}
            <div className="mb-4">
              <label htmlFor="age" className="block text-sm text-gray-400 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            {/* Gender Field */}
            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm text-gray-400 mb-2">
                Gender
              </label>
              <select
                id="gender"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Phone Number Field */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm text-gray-400 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Address Field */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm text-gray-400 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                Sign Up
              </button>
            </div>

            <div className="text-center text-gray-400">Already have an account?</div>

            <Link
              to="/login"
              className="mt-2 w-full px-4 py-2 text-center bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
