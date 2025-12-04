"use client";

import { useState } from "react";
import { Lock, Mail, LogIn } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const submitLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Top Gradient Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-2"></div>

      {/* Header with Branding */}
      <header className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">

          {/* Government Info */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <div className="text-xs md:text-sm text-gray-600">
              <span className="font-semibold">Government of West Bengal</span> |
              District Administration Jalpaiguri
            </div>
            <div className="flex items-center gap-4 text-xs md:text-sm">
              <a className="text-blue-600 hover:text-blue-800" href="#">
                Screen Reader
              </a>
              <span className="text-gray-300">|</span>
              <a className="text-blue-600 hover:text-blue-800" href="#">
                Accessibility
              </a>
            </div>
          </div>

          {/* Logo Section */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Left Logo */}
            <div className="absolute left-0 md:left-4">
              <img src="/bb.png" className="w-14 md:w-32" />
            </div>

            {/* Center Logo (District) */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full">
                <img src="/jalpaiguri.png" className="w-full h-full object-cover" />
              </div>
              <p className="mt-2 text-lg font-bold text-gray-800">
                Jalpaiguri District
              </p>
              <p className="text-gray-600 text-sm">জলপাইগুড়ি জেলা</p>
            </div>

            {/* Right Logos */}
            <div className="absolute right-0 md:right-4 flex gap-4">
              <img src="/sb.png" className="w-14 md:w-24" />
              <img src="/MissionLogov1.jpg" className="w-14 md:w-24" />
            </div>
          </div>
        </div>
      </header>

      {/* Login Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative py-16">
        {/* Background Dots */}
        <div className="absolute inset-0 opacity-10">
          <div
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
            className="w-full h-full"
          ></div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 bg-white shadow-2xl rounded-xl p-8 w-full max-w-md border-t-4 border-orange-600">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-6">
            Login to Dashboard
          </h2>

          <form onSubmit={submitLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <Mail className="text-gray-500" size={20} />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-3 px-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3">
                <Lock className="text-gray-500" size={20} />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3 px-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
            >
              {loading ? "Please wait..." : "Login"}
              <LogIn size={20} />
            </button>
          </form>

          {/* Forgot Password */}
          <p className="text-center mt-4">
            <a className="text-blue-700 hover:text-blue-900 font-medium" href="#">
              Forgot Password?
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-4 text-center text-sm">
        © 2024 District Administration, Jalpaiguri |
        Smart Solid Waste Management System
      </footer>
    </div>
  );
}
