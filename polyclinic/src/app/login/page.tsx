// pages/login.js
"use client";
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log('Logging in', { username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form className="p-8 bg-white rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Log In
        </button>
      </form>
    </div>
  );
}
