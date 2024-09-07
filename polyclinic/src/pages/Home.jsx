import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Home = () => {
  return (
    <div className="home h-screen w-screen flex flex-col items-center justify-center bg-blue-500">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="text-lg mb-6">This is a simple homepage for your React app.</p>
        <div className="flex space-x-4">
          <Link to="/login">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">
              Go to Login
            </button>
          </Link>
          <Link to="/registration">
            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500">
              Go to Registration
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
