import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase"; // Make sure this points to your firebase.js
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export default function TestamentPage() {
  const { userName } = useParams();
  const navigate = useNavigate();

  const [bulletInput, setBulletInput] = useState("");
  const [resolutionInput, setResolutionInput] = useState("");
  const [entries, setEntries] = useState([]);

  // Load entries from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "testamentEntries"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddEntry = async () => {
    if (!bulletInput.trim() || !resolutionInput.trim()) return;

    await addDoc(collection(db, "testamentEntries"), {
      author: userName,
      bullet: bulletInput.trim(),
      resolution: resolutionInput.trim(),
      timestamp: serverTimestamp(),
    });

    setBulletInput("");
    setResolutionInput("");
  };

  const handleDeleteEntry = async (id) => {
    await deleteDoc(doc(db, "testamentEntries", id));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 px-4 py-10 gap-8">
      <h1 className="text-5xl font-[Dancing_Script] text-yellow-700 drop-shadow-md">
        James Testament
      </h1>

      {/* Entry Inputs */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="New bullet point..."
          value={bulletInput}
          onChange={(e) => setBulletInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="text"
          placeholder="Resolution..."
          value={resolutionInput}
          onChange={(e) => setResolutionInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleAddEntry}
          className="bg-yellow-500 text-white px-6 py-3 rounded-2xl hover:bg-yellow-600 shadow-md"
        >
          Add
        </button>
      </div>

      {/* Entries Display */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left: Bullets */}
        <div className="flex-1 flex flex-col gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl shadow-md p-4 border-2 border-yellow-400 relative"
            >
              • {entry.bullet}
              <div className="text-xs text-gray-500 mt-1">
                {entry.timestamp?.toDate
                  ? entry.timestamp.toDate().toLocaleString()
                  : ""}
              </div>
              <button
                onClick={() => handleDeleteEntry(entry.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Right: Resolutions */}
        <div className="flex-1 flex flex-col gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl shadow-md p-4 border-2 border-yellow-600 relative"
            >
              {entry.resolution}
              <div className="text-xs text-gray-500 mt-1">
                {entry.timestamp?.toDate
                  ? entry.timestamp.toDate().toLocaleString()
                  : ""}
              </div>
              <button
                onClick={() => handleDeleteEntry(entry.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate(`/user/${userName}`)}
        className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-2xl hover:bg-yellow-600 shadow-md"
      >
        Back to My Space
      </button>
    </div>
  );
}
