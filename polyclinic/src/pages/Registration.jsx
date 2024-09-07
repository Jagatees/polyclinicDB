import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Registration = () => {
  return (
    <div className="h-screen w-screen flex">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col bg-gray-900 text-white justify-between p-8">
        <div>
          <h1 className="text-4xl font-bold mb-8">Acme Inc</h1>
        </div>
        <div className="mb-8">
          <p className="text-lg">
            "This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
          </p>
          <p className="mt-4 font-semibold">Sofia Davis</p>
        </div>
      </div>

      {/* Right Side (Registration Form) */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-800 p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold text-white mb-6">Create an account</h2>
          <form>
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2" htmlFor="name">
                Enter your name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your name"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2" htmlFor="email">
                Enter your email below to create your account
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="name@example.com"
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your password"
              />
            </div>

            <div className="mb-6">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">
                Sign Up
              </button>
            </div>

            <div className="mb-6 text-center text-gray-400">OR</div>

            {/* Go to Login Button */}
            <div>
            <Link to="/login">
            <button className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
                Go to Login
              </button>
          </Link>
            
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-gray-500">
            By clicking Sign Up, you agree to our{" "}
            <a href="#" className="text-indigo-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-500 hover:underline">
              Privacy Policy
            </a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
