import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function TestamentPage() {
  const { userName } = useParams();
  const navigate = useNavigate();

  const [problemInput, setProblemInput] = useState("");
  const [resolutionInput, setResolutionInput] = useState("");
  const [entries, setEntries] = useState([]);

  const entriesRef = collection(db, "testamentEntries");

  // Load entries from Firestore
  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getDocs(entriesRef);
      const fetched = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(fetched.reverse()); // Newest first
    };
    fetchEntries();
  }, []);

  // Add new problem/resolution
  const handleAddEntry = async () => {
    if (!problemInput.trim() || !resolutionInput.trim()) return;

    const newEntry = {
      problem: problemInput.trim(),
      resolution: resolutionInput.trim(),
      author: userName,
      timestamp: new Date().toISOString(),
    };

    const docRef = await addDoc(entriesRef, newEntry);
    setEntries([{ id: docRef.id, ...newEntry }, ...entries]);

    setProblemInput("");
    setResolutionInput("");
  };

  // Delete entry
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "testamentEntries", id));
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  // Format timestamp nicely
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString([], { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 px-4 py-10 gap-8">
      <h1 className="text-5xl font-[Dancing_Script] text-yellow-700 drop-shadow-md">
        James Testament
      </h1>

      {/* Input Section */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Problem..."
          value={problemInput}
          onChange={(e) => setProblemInput(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <input
          type="text"
          placeholder="Resolution..."
          value={resolutionInput}
          onChange={(e) => setResolutionInput(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <button
          onClick={handleAddEntry}
          className="bg-yellow-500 text-white px-6 py-3 rounded-2xl hover:bg-yellow-600 transition shadow-md w-max self-end"
        >
          Add Entry
        </button>
      </div>

      {/* Display Entries */}
      <div className="w-full max-w-6xl flex flex-col gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex gap-4 bg-white rounded-2xl shadow-md p-4 border-2 border-yellow-300"
          >
            <div className="flex-1">
              <span className="font-semibold text-yellow-700">Problem:</span>
              <p>{entry.problem}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatTimestamp(entry.timestamp)}
              </p>
            </div>
            <div className="flex-1">
              <span className="font-semibold text-yellow-700">Resolution:</span>
              <p>{entry.resolution}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatTimestamp(entry.timestamp)}
              </p>
            </div>
            <button
              onClick={() => handleDelete(entry.id)}
              className="text-red-500 hover:text-red-700 font-bold self-start"
            >
              ×
            </button>
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
