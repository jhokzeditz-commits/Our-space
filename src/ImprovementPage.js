import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ImprovementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, partner } = location.state;

  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("improvementNotes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  const saveNotes = (allNotes) => {
    localStorage.setItem("improvementNotes", JSON.stringify(allNotes));
    setNotes(allNotes);
  };

  const handleSubmitNote = () => {
    if (!noteInput.trim()) return;

    const newNote = {
      author: currentUser,
      recipient: partner,
      text: noteInput.trim(),
      replies: [],
      timestamp: new Date().toLocaleString(), // timestamp
    };

    saveNotes([...notes, newNote]);
    setNoteInput("");
  };

  const handleAddReply = (index, replyText) => {
    if (!replyText.trim()) return;
    const updated = [...notes];
    updated[index].replies.push({ 
      author: currentUser, 
      text: replyText,
      timestamp: new Date().toLocaleString(), // timestamp
    });
    saveNotes(updated);
  };

  const handleDeleteNote = (index) => {
    const updated = [...notes];
    updated.splice(index, 1);
    saveNotes(updated);
  };

  const leftNotes = notes.filter((n) => n.author === partner);
  const rightNotes = notes.filter((n) => n.author === currentUser);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 px-4 py-10 gap-8">
      <h1 className="text-5xl font-[Dancing_Script] text-pink-600 drop-shadow-md">
        {currentUser === "James" ? "How I can improve" : "How James can improve"}
      </h1>

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

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">
          {leftNotes.map((n, i) => (
            <NoteCard
              key={i}
              note={n}
              onReply={(text) => handleAddReply(notes.findIndex(note => note === n), text)}
              onDelete={() => handleDeleteNote(notes.findIndex(note => note === n))}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-4 items-end">
          {rightNotes.map((n, i) => (
            <NoteCard
              key={i}
              note={n}
              onReply={(text) => handleAddReply(notes.findIndex(note => note === n), text)}
              onDelete={() => handleDeleteNote(notes.findIndex(note => note === n))}
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
      <div className="text-xs text-gray-500 mt-1">{note.timestamp}</div>

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
      >
        ×
      </button>

      <div className="flex flex-col gap-2 mt-2">
        {note.replies.map((reply, i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-2 pl-4">
            <span className="font-semibold text-gray-700">{reply.author}:</span> {reply.text}
            <div className="text-xs text-gray-500">{reply.timestamp}</div>
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
