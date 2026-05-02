/** @format */

import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import UploadPDF from "./components/UploadPDF";
import SearchCase from "./components/SearchCase";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refresh, setRefresh] = useState(0);

  const handleUploadSuccess = () => {
    setRefresh((r) => r + 1);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
              <svg
                viewBox="0 0 64 64"
                width="36"
                height="36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="30"
                  y="4"
                  width="4"
                  height="56"
                  rx="2"
                  fill="#1e3a8a"
                />
                <rect
                  x="8"
                  y="20"
                  width="48"
                  height="4"
                  rx="2"
                  fill="#1e3a8a"
                />
                <circle cx="8" cy="22" r="5" fill="#1e3a8a" />
                <circle cx="56" cy="22" r="5" fill="#1e3a8a" />
                <rect
                  x="20"
                  y="52"
                  width="24"
                  height="4"
                  rx="2"
                  fill="#1e3a8a"
                />
                <rect
                  x="14"
                  y="22"
                  width="8"
                  height="30"
                  rx="1"
                  fill="#2563eb"
                />
                <rect
                  x="42"
                  y="22"
                  width="8"
                  height="30"
                  rx="1"
                  fill="#2563eb"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">NyayTrack</h1>
              <p className="text-blue-200 text-xs">
                AI-Powered Court Order Compliance Engine
              </p>
            </div>
          </div>
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={
                activeTab === "dashboard" ?
                  "px-4 py-2 rounded-lg bg-white text-blue-900 font-semibold text-sm"
                : "px-4 py-2 rounded-lg text-white hover:bg-blue-800 text-sm"
              }
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={
                activeTab === "upload" ?
                  "px-4 py-2 rounded-lg bg-white text-blue-900 font-semibold text-sm"
                : "px-4 py-2 rounded-lg text-white hover:bg-blue-800 text-sm"
              }
            >
              Upload Judgment
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={
                activeTab === "search" ?
                  "px-4 py-2 rounded-lg bg-white text-blue-900 font-semibold text-sm"
                : "px-4 py-2 rounded-lg text-white hover:bg-blue-800 text-sm"
              }
            >
              Search Case
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard key={refresh} />}
        {activeTab === "upload" && (
          <UploadPDF onSuccess={handleUploadSuccess} />
        )}
        {activeTab === "search" && <SearchCase />}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-200 text-center py-4 mt-12 text-sm">
        <p>
          NyayTrack — Bridging Court Orders to Ground-Level Action | AI for
          Bharat Hackathon 2026
        </p>
      </footer>
    </div>
  );
}

export default App;
