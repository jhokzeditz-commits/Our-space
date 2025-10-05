import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./firebase"; // your Firebase config
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";

export default function ImprovementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, partner } = location.state;

  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState([]);

  const notesCol = collection(db, "improvementNotes");

  // Load notes from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(notesCol, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(data);
    });

    return () => unsubscribe();
  }, []);

  // Submit new note
  const handleSubmitNote = async () => {
    if (!noteInput.trim()) return;

    await addDoc(notesCol, {
      author: currentUser,
      recipient: partner,
      text: noteInput.trim(),
      replies: [],
      timestamp: new Date().toISOString(),
    });

    setNoteInput("");
  };

  // Add reply
  const handleAddReply = async (noteId, replyText) => {
    if (!replyText.trim()) return;

    const reply = {
      author: currentUser,
      text: replyText,
      timestamp: new Date().toISOString(),
    };

    const noteDoc = doc(db, "improvementNotes", noteId);
    await updateDoc(noteDoc, {
      replies: arrayUnion(reply),
    });
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    const noteDoc = doc(db, "improvementNotes", noteId);
    await deleteDoc(noteDoc);
  };

  const leftNotes = notes.filter((n) => n.author === partner);
  const rightNotes = notes.filter((n) => n.author === currentUser);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 px-4 py-10 gap-8">
      <h1 className="text-5xl font-[Dancing_Script] text-pink-600 drop-shadow-md">
        {currentUser === "James" ? "How I can improve" : "How James can improve"}
      </h1>

      {/* Input */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 flex flex-col gap-4">
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg resize-none"
          placeholder={`Write a note for ${partner} to see...`}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
        />
        <button
          onClick={handleSubmitNote}
          className="bg-pink-600 text-white px-6 py-3 rounded-2xl hover:bg-pink-700 transition shadow-md w-max self-end"
        >
          Submit
        </button>
      </div>

      {/* Notes layout */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left: partner's notes */}
        <div className="flex-1 flex flex-col gap-4">
          {leftNotes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onReply={(text) => handleAddReply(n.id, text)}
              onDelete={() => handleDeleteNote(n.id)}
            />
          ))}
        </div>

        {/* Right: your notes */}
        <div className="flex-1 flex flex-col gap-4 items-end">
          {rightNotes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onReply={(text) => handleAddReply(n.id, text)}
              onDelete={() => handleDeleteNote(n.id)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate(`/user/${currentUser}`)}
        className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition shadow-md"
      >
        Back to My Space
      </button>
    </div>
  );
}

const NoteCard = ({ note, onReply, onDelete }) => {
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(replyText);
    setReplyText("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 relative border-2 border-purple-300 max-w-md">
      <span className="font-semibold text-pink-600">{note.author} wrote:</span>
      <p>{note.text}</p>

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
      >
        ×
      </button>

      <div className="flex flex-col gap-2 mt-2">
        {note.replies.map((reply, i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-2 pl-4">
            <span className="font-semibold text-gray-700">{reply.author}:</span> {reply.text}{" "}
            <span className="text-xs text-gray-400">({new Date(reply.timestamp).toLocaleString()})</span>
          </div>
        ))}

        <div className="flex gap-2 mt-1">
          <input
            type="text"
            placeholder="Reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
            className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            onClick={handleSendReply}
            className="bg-pink-500 text-white px-3 py-2 rounded-xl hover:bg-pink-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
