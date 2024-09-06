"use client";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log("Registering with name:", name);
    console.log("Registering with email:", email);
    console.log("Password:", password); // Reminder: In production, handle this more securely
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex flex-row min-h-screen w-full">
        <div className="w-1/2 flex flex-col justify-between items-start p-10 bg-gray-900">
          <div className="self-start">
            <span className="text-2xl font-bold text-white">Zheng Gen Inc</span>
          </div>
          <div className="text-sm font-light italic text-gray-300">
            "This library has saved me countless hours of work and helped me
            deliver stunning designs to my clients faster than ever before." -
            Sofia Davis
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center bg-black">
          <div className="w-full max-w-md p-8 space-y-6 bg-black rounded-lg shadow-lg">
            <div className="flex justify-center">
              <span className="text-2xl font-bold text-white">Register</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-400"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 rounded-lg bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 rounded-lg bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-400"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 rounded-lg bg-gray-800 border-transparent focus:border-indigo-500 focus:ring-indigo-500 text-white placeholder-gray-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Register
              </button>
              <div className="relative flex items-center text-sm my-4 py-2 -4 ">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink mx-4 text-gray-400">
                  or continue with
                </span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              <Link href="/login">
                <button
                  type="button"
                  onClick={() => console.log("Navigate to Sign In")}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Sign In
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
