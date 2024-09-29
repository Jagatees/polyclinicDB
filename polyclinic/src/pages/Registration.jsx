import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import image from '../assets/images.jpg';

// Define the schema for form validation using Zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  age: z.number().min(18, "You must be at least 18 years old"),
  gender: z.enum(['Male', 'Female', 'Other'], "Gender selection is required"),
  phone: z.string().length(10, "Phone number must be exactly 10 digits"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

const Registration = () => {
  const navigate = useNavigate();

  // States to capture user input
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Update input changes
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    let formattedValue = value;
    
    // Check if the input is meant to be a number and convert it
    if (id === 'age' && value !== '') {
      formattedValue = Number(value);
    }
    
    setFormData(prev => ({ ...prev, [id]: formattedValue }));
  };
  
  // Handle form submission
  const handleRegistration = async (event) => {
    event.preventDefault();
    try {
      const result = await formSchema.parseAsync(formData);
  
      const userInfo = {
        role_id: 1, 
        username: formData.username,
        password_hash: formData.password, 
        email: formData.email,
      };
  
      const roleInfo = {
        doctor: {
          first_name: [], 
          last_name: [], 
          phone_number: []
        },
        patient: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: formData.age,
          gender: formData.gender,
          phone_number: formData.phone,
          address: formData.address
        }
      };

      // Submit the data
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInfo, roleInfo }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Registration failed');
          return response.json();
        })
        .then((data) => {
          console.log('Registration successful:', data);
          navigate('/userdashboard'); // Navigate to the home page on success
        })
        .catch((error) => {
          console.error('Registration failed:', error);
          // You can handle errors specific to your fields if needed
        });
    } catch (error) {
      setErrors(error.flatten().fieldErrors);
      console.error('Validation failed:', error);
    }
  };
  

  return (
    <div className="h-screen w-screen flex">
      <div
        className="w-1/2 flex flex-col justify-between p-8 text-white"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <div>
          <h1 className="text-4xl font-bold mb-8">Polyclinic Inc</h1>
          <p className="text-lg italic">"INF2003-Databases-Project-1"</p>
          <p className="mt-4 font-semibold">P2-Group 13</p>
        </div>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-800 p-8">
        <div className="w-full max-w-2xl mx-auto bg-gray-800 p-8 text-white rounded-lg">
          <h2 className="text-3xl font-semibold mb-6">Create an account</h2>
          <form onSubmit={handleRegistration} className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm mb-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-gray-700 rounded ${errors.firstName ? 'border border-red-500' : ''}`}
                />
                {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-gray-700 rounded ${errors.lastName ? 'border border-red-500' : ''}`}
                />
                {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/3">
                <label htmlFor="username" className="block text-sm mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-gray-700 rounded ${errors.username ? 'border border-red-500' : ''}`}
                />
                {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
              </div>
              <div className="w-1/3">
                <label htmlFor="age" className="block text-sm mb-1">Age</label>
                <input
                  type="number"
                  id="age"
                  placeholder="30"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-gray-700 rounded ${errors.age ? 'border border-red-500' : ''}`}
                />
                {errors.age && <p className="text-red-500 text-xs italic">{errors.age}</p>}
              </div>
              <div className="w-1/3">
                <label htmlFor="gender" className="block text-sm mb-1">Gender</label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-gray-700 rounded ${errors.gender ? 'border border-red-500' : ''}`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs italic">{errors.gender}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm mb-1">Phone Number</label>
              <input
                type="text"
                id="phone"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-2 bg-gray-700 rounded ${errors.phone ? 'border border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm mb-1">Address</label>
              <input
                type="text"
                id="address"
                placeholder="1234 Main St"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full p-2 bg-gray-700 rounded ${errors.address ? 'border border-red-500' : ''}`}
              />
              {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-1">Email</label>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-2 bg-gray-700 rounded ${errors.email ? 'border border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full p-2 bg-gray-700 rounded ${errors.password ? 'border border-red-500' : ''}`}
                />
                {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Sign Up
              </button>
            </div>
            <div className="text-center mt-4">
              Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
