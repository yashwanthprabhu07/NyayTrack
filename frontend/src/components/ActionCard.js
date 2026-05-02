/** @format */

import React from "react";
import { updateStatus } from "../api";

const RAG_COLORS = {
  red: {
    bg: "bg-red-100",
    border: "border-red-500",
    badge: "bg-red-500",
    label: "Overdue",
  },
  amber: {
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    badge: "bg-yellow-500",
    label: "Due Soon",
  },
  green: {
    bg: "bg-green-100",
    border: "border-green-500",
    badge: "bg-green-500",
    label: "Compliant",
  },
  grey: {
    bg: "bg-gray-100",
    border: "border-gray-400",
    badge: "bg-gray-400",
    label: "No Deadline",
  },
};

function ActionCard({ card, onRefresh }) {
  const rag = RAG_COLORS[card.rag_status] || RAG_COLORS.grey;

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus(card.id, newStatus);
      onRefresh();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div
      className={`rounded-xl border-l-4 ${rag.border} ${rag.bg} p-5 shadow-md`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase">
            {card.directive_type || "General"}
          </span>
          <h3 className="font-bold text-gray-800 text-lg mt-1">
            {card.case_number || "Unknown Case"}
          </h3>
          <p className="text-sm text-gray-600">{card.court_name}</p>
        </div>
        <span
          className={`${rag.badge} text-white text-xs px-3 py-1 rounded-full font-semibold`}
        >
          {rag.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="bg-white rounded-lg p-2">
          <span className="text-gray-500 text-xs">Petitioner</span>
          <p className="font-semibold text-gray-800 truncate">
            {card.petitioner || "N/A"}
          </p>
        </div>
        <div className="bg-white rounded-lg p-2">
          <span className="text-gray-500 text-xs">Respondent</span>
          <p className="font-semibold text-gray-800 truncate">
            {card.respondent || "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 mb-3">
        <span className="text-xs text-gray-500 font-semibold uppercase">
          Directive
        </span>
        <p className="text-sm text-gray-700 mt-1">
          {card.directive_text || "N/A"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="bg-white rounded-lg p-2">
          <span className="text-gray-500 text-xs">Authority</span>
          <p className="font-semibold text-gray-800">
            {card.responsible_authority || "N/A"}
          </p>
        </div>
        <div className="bg-white rounded-lg p-2">
          <span className="text-gray-500 text-xs">Deadline</span>
          <p className="font-semibold text-gray-800">
            {card.deadline_date || "Not specified"}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>AI Confidence</span>
          <span>{Math.round((card.confidence_score || 0) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(card.confidence_score || 0) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["pending", "in_progress", "compliant", "overdue"].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`text-xs px-3 py-1 rounded-full border ${card.status === s ? "bg-blue-900 text-white border-blue-900" : "bg-white text-gray-600 border-gray-300"}`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">{card.source_filename}</p>
    </div>
  );
}

export default ActionCard;
