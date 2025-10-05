import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";

export default function TestamentPage() {
  const { userName } = useParams();
  const navigate = useNavigate();

  const [bulletInput, setBulletInput] = useState("");
  const [resolutionInput, setResolutionInput] = useState("");
  const [entries, setEntries] = useState([]);

  const testamentCol = collection(db, "jamesTestament");

  // Load entries in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(testamentCol, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(fetched);
    });
    return () => unsubscribe();
  }, []);

  const handleAddBullet = async () => {
    if (!bulletInput.trim()) return;
    await addDoc(testamentCol, {
      bullet: bulletInput.trim(),
      resolution: "",
      createdAt: serverTimestamp(),
    });
    setBulletInput("");
  };

  const handleAddResolution = async (entryId) => {
    if (!resolutionInput.trim()) return;
    const entryDoc = doc(db, "jamesTestament", entryId);
    await updateDoc(entryDoc, {
      resolution: resolutionInput.trim(),
    });
    setResolutionInput("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 px-4 py-10 gap-8">
      <h1 className="text-5xl font-[Dancing_Script] text-yellow-700 drop-shadow-md mb-6">
        James Testament
      </h1>

      {/* Add new bullet */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-4">
        <textarea
          rows={2}
          placeholder="Enter a new bullet point..."
          value={bulletInput}
          onChange={(e) => setBulletInput(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg resize-none"
        />
        <button
          onClick={handleAddBullet}
          className="bg-yellow-500 text-white px-6 py-3 rounded-2xl hover:bg-yellow-600 transition shadow-md self-end"
        >
          Add Bullet
        </button>
      </div>

      {/* Display bullets and resolutions */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left: bullets */}
        <div className="flex-1 flex flex-col gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl shadow-md p-4 border-2 border-yellow-300 max-w-md"
            >
              <span className="font-semibold text-yellow-700">Bullet:</span>
              <p>{entry.bullet}</p>
            </div>
          ))}
        </div>

        {/* Right: resolutions */}
        <div className="flex-1 flex flex-col gap-4 items-end">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl shadow-md p-4 border-2 border-yellow-400 max-w-md flex flex-col gap-2"
            >
              <span className="font-semibold text-yellow-800">Resolution:</span>
              {entry.resolution ? (
                <p>{entry.resolution}</p>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a resolution..."
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                  <button
                    onClick={() => handleAddResolution(entry.id)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-xl hover:bg-yellow-600 transition"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
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
