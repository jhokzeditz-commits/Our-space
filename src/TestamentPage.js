import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TestamentPage() {
  const { userName } = useParams();
  const navigate = useNavigate();

  const [bulletInput, setBulletInput] = useState("");
  const [resolutionInput, setResolutionInput] = useState("");
  const [entries, setEntries] = useState([]);

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("jamesTestamentEntries");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  // Save entries to localStorage
  const saveEntries = (allEntries) => {
    localStorage.setItem("jamesTestamentEntries", JSON.stringify(allEntries));
    setEntries(allEntries);
  };

  const handleAddEntry = () => {
    if (!bulletInput.trim() || !resolutionInput.trim()) return;

    const newEntry = {
      bullet: bulletInput.trim(),
      resolution: resolutionInput.trim(),
      timestamp: new Date().toLocaleString(),
    };

    saveEntries([...entries, newEntry]);
    setBulletInput("");
    setResolutionInput("");
  };

  const handleDeleteEntry = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    saveEntries(updated);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 px-4 py-10 gap-8">
      <h1 className="text-5xl font-[Dancing_Script] text-yellow-700 drop-shadow-md mb-6">
        James Testament
      </h1>

      {/* Input Section */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Bullet point..."
          value={bulletInput}
          onChange={(e) => setBulletInput(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg"
        />
        <input
          type="text"
          placeholder="Resolution..."
          value={resolutionInput}
          onChange={(e) => setResolutionInput(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg"
        />
        <button
          onClick={handleAddEntry}
          className="bg-yellow-500 text-white px-6 py-3 rounded-2xl hover:bg-yellow-600 transition shadow-md w-max self-end"
        >
          Add Entry
        </button>
      </div>

      {/* Entries Section */}
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl shadow-md p-4 border-2 border-yellow-400"
          >
            {/* Left: Bullet */}
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-700 mb-1">Bullet</h2>
              <ul className="list-disc list-inside">
                <li>{entry.bullet}</li>
              </ul>
              <span className="text-xs text-gray-500">{entry.timestamp}</span>
            </div>

            {/* Right: Resolution */}
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-700 mb-1">Resolution</h2>
              <p>{entry.resolution}</p>
              <span className="text-xs text-gray-500">{entry.timestamp}</span>
              <button
                onClick={() => handleDeleteEntry(i)}
                className="mt-2 text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate(`/user/${userName}`)}
        className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-2xl hover:bg-yellow-600 transition shadow-md"
      >
        Back to My Space
      </button>
    </div>
  );
}
