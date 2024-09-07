
import React from 'react';

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

      {/* Right Side (Login Form) */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-800 p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold text-white mb-6">Create an account</h2>
          <form>
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

            <div className="mb-6">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">
                Sign In with Email
              </button>
            </div>

            <div className="mb-6 text-center text-gray-400">OR CONTINUE WITH</div>

            <div>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-5 h-5 mr-2"
                >
                  <path d="M12 .5C5.373.5.5 5.373.5 12c0 5.34 3.64 9.797 8.414 11.323.616.11.84-.267.84-.594 0-.293-.01-1.068-.015-2.097-3.424.744-4.147-1.65-4.147-1.65-.56-1.426-1.37-1.806-1.37-1.806-1.122-.766.086-.75.086-.75 1.24.086 1.893 1.275 1.893 1.275 1.104 1.892 2.897 1.345 3.603 1.03.112-.799.432-1.344.785-1.652-2.731-.31-5.602-1.365-5.602-6.076 0-1.341.48-2.438 1.27-3.296-.127-.31-.55-1.555.12-3.243 0 0 1.027-.33 3.368 1.257.976-.272 2.02-.408 3.06-.414 1.038.006 2.084.142 3.06.414 2.34-1.587 3.365-1.257 3.365-1.257.672 1.688.25 2.933.125 3.243.794.858 1.27 1.955 1.27 3.296 0 4.722-2.877 5.762-5.614 6.065.445.384.839 1.146.839 2.31 0 1.666-.015 3.01-.015 3.422 0 .333.22.714.848.59C19.867 21.796 23.5 17.34 23.5 12 23.5 5.373 18.627.5 12 .5z" />
                </svg>
                GitHub
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-gray-500">
            By clicking continue, you agree to our{" "}
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
