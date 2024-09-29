import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../assets/images.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = (event) => {
    event.preventDefault();
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
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
      if (data) {

        localStorage.setItem("patient_id", data.message.user.patient_id);
        localStorage.setItem("role_id_fk", data.message.user.role_id_fk);
        localStorage.setItem("user_id", data.message.user.user_id);
      
        switch (data.message.user.role_id_fk) {
          case 1:
            navigate("/doctordashboard");
            break;
          case 2:
            navigate("/userdashboard");
            break;
          case 3:
            navigate("/admindashboard");
            break;
          default:
            navigate("/home");
            break;
        }
      
      }
    })
    .catch((error) => {
      console.error("Login failed:", error);
    });
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
        <h1 className="text-4xl font-bold mb-8">Polyclinic Inc</h1>
        <p className="text-lg italic">"INF2003-Databases-Project-1"</p>
        <p className="mt-4 font-semibold">P2-Group 13</p>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-800 p-8">
        <h2 className="text-3xl font-semibold text-white mb-6">Login</h2>
        <form onSubmit={handleLogIn}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2" htmlFor="email">
              Enter your email below to login
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
          <div className="mb-4">
            <label
              className="block text-sm text-gray-400 mb-2"
              htmlFor="password"
            >
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
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">
              Sign In
            </button>
          </div>
          <div className="mb-6 text-center text-gray-400">OR</div>

          {/* Go to Registration Button */}
          <div>
            <Link to="/registration">
              <button className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
                Go to Registration
              </button>
            </Link>
          </div>
          <div className="mt-6 text-sm text-center text-gray-500">
            By clicking Sign In, you agree to our{" "}
            <a href="#" className="text-indigo-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-500 hover:underline">
              Privacy Policy
            </a>
            .
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
