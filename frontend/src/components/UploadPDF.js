/** @format */

import React, { useState } from "react";
import { uploadPDF } from "../api";

function UploadPDF({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadPDF(formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload Court Judgment
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-white mb-4">
        <p className="text-gray-600 font-semibold text-lg mb-4">
          Select a court judgment PDF
        </p>
        <input
          type="file"
          accept=".pdf,.PDF"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-900 file:text-white"
        />
        {file && (
          <p className="mt-3 text-green-600 font-semibold">
            {file.name} selected
          </p>
        )}
        <p className="text-gray-400 text-sm mt-2">
          Supports digital and scanned PDFs. Max 20MB
        </p>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Processing with AI..." : "Extract Directives with AI"}
        </button>
      )}

      {loading && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 text-center">
          <p className="text-blue-800 font-semibold">
            NVIDIA NIM AI is analyzing the judgment...
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Extracting directives, authorities, and deadlines
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-green-800 font-bold text-lg mb-4">
            Extraction Complete!
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-900">
                {result.directives_found}
              </p>
              <p className="text-gray-500 text-xs">Directives Found</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                {result.directives_saved}
              </p>
              <p className="text-gray-500 text-xs">Cards Saved</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {result.pdf_type}
              </p>
              <p className="text-gray-500 text-xs">PDF Type</p>
            </div>
          </div>
          <button
            onClick={onSuccess}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
          >
            View Action Cards Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadPDF;
