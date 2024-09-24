import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useEffect, useState } from "react";

const Home = () => {

  const [apiResponse, setApiResponse] = useState(null); // State to store API response

    useEffect(() => {
      fetch('/api/test')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setApiResponse(data); 
          console.log('Flask API response:', data); 
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }, []); 


  return (
    <div className="home h-screen w-screen flex flex-col items-center justify-center bg-blue-500">
      <div className="text-center text-white mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Book same-day appointments at SIT clinic
        </h1>
        <p className="text-lg mb-6">Lighting fast booking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <Link
          to="/appointments"
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition"
        >
          <img
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Vaccination"
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Book an Appointments</h2>
          <p className="text-gray-600">Able to book appoiments with doctor</p>
        </Link>

        <Link
          to="/bill"
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition"
        >
          <img
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Child Vaccination"
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">View Bills</h2>
          <p className="text-gray-600">
            Get the vaccinations your child needs, free of charge
          </p>
        </Link>

        <Link
          to="/doctordashbaord"
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition"
        >
          <img
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Child Vaccination"
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Doctor Dashboard</h2>
          <p className="text-gray-600">Doctor Dashboard</p>
        </Link>

        <Link
          to="/admindashboard"
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition"
        >
          <img
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Child Vaccination"
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Admin Dashboard</p>
        </Link>

        <Link
          to="/userdashboard"
          className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition"
        >
          <img
            src="https://picsum.photos/200/300" // Placeholder image URL
            alt="Child Vaccination"
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">User Dashboard</h2>
          <p className="text-gray-600">User Dashboard</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;

