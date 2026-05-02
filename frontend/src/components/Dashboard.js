/** @format */

import React, { useState, useEffect } from "react";
import { getActions } from "../api";
import ActionCard from "./ActionCard";

function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await getActions();
      setCards(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load action cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const filtered =
    filter === "all" ? cards : cards.filter((c) => c.rag_status === filter);

  const counts = {
    all: cards.length,
    red: cards.filter((c) => c.rag_status === "red").length,
    amber: cards.filter((c) => c.rag_status === "amber").length,
    green: cards.filter((c) => c.rag_status === "green").length,
    grey: cards.filter((c) => c.rag_status === "grey").length,
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          className="bg-white rounded-xl p-4 shadow text-center cursor-pointer"
          onClick={() => setFilter("all")}
        >
          <p className="text-3xl font-bold text-blue-900">{counts.all}</p>
          <p className="text-gray-500 text-sm">Total Orders</p>
        </div>
        <div
          className="bg-red-50 rounded-xl p-4 shadow text-center cursor-pointer"
          onClick={() => setFilter("red")}
        >
          <p className="text-3xl font-bold text-red-600">{counts.red}</p>
          <p className="text-gray-500 text-sm">Overdue</p>
        </div>
        <div
          className="bg-yellow-50 rounded-xl p-4 shadow text-center cursor-pointer"
          onClick={() => setFilter("amber")}
        >
          <p className="text-3xl font-bold text-yellow-600">{counts.amber}</p>
          <p className="text-gray-500 text-sm">Due Soon</p>
        </div>
        <div
          className="bg-green-50 rounded-xl p-4 shadow text-center cursor-pointer"
          onClick={() => setFilter("green")}
        >
          <p className="text-3xl font-bold text-green-600">{counts.green}</p>
          <p className="text-gray-500 text-sm">Compliant</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "red", "amber", "green", "grey"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === f ? "bg-blue-900 text-white" : "bg-white text-gray-600"}`}
          >
            {f === "all" ?
              "All Orders"
            : f === "red" ?
              "Overdue"
            : f === "amber" ?
              "Due Soon"
            : f === "green" ?
              "Compliant"
            : "No Deadline"}
          </button>
        ))}
        <button
          onClick={fetchCards}
          className="ml-auto px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Loading action cards...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">No action cards found</p>
          <p className="text-gray-400 text-sm mt-2">
            Upload a court judgment PDF to get started
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((card) => (
          <ActionCard key={card.id} card={card} onRefresh={fetchCards} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
