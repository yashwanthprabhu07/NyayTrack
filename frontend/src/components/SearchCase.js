/** @format */

import React, { useState } from "react";
import { searchCase } from "../api";
import ActionCard from "./ActionCard";

function SearchCase() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await searchCase(query);
      setResults(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setResults([]);
      } else {
        setError("Search failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Search by Case Number
      </h2>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <p className="text-gray-500 mb-4">
          Enter your case number to check compliance status.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. WP/1234/2024 or 1316/2021"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-lg"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">
            No orders found for: <strong>{query}</strong>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try uploading the judgment first
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="text-gray-600 mb-4 font-semibold">
            {results.length} order(s) found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((card) => (
              <ActionCard key={card.id} card={card} onRefresh={handleSearch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchCase;
