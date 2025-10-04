import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReflectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, partner } = location.state;

  const [reflectionInput, setReflectionInput] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [reflections, setReflections] = useState([]);

  // Load all reflections from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("dailyReflections");
    if (stored) setReflections(JSON.parse(stored));
  }, []);

  // Save reflections to localStorage
  const saveReflections = (allReflections) => {
    localStorage.setItem("dailyReflections", JSON.stringify(allReflections));
    setReflections(allReflections);
  };

  const handleSubmitReflection = () => {
    if (!selectedEmoji || !reflectionInput.trim()) return;

    const newReflection = {
      author: currentUser,
      text: reflectionInput.trim(),
      emoji: selectedEmoji,
      replies: [],
      timestamp: new Date().toLocaleString(), // timestamp
    };

    const updatedReflections = [...reflections, newReflection];
    saveReflections(updatedReflections);

    setReflectionInput("");
    setSelectedEmoji("");
    setReflectionText("");
  };

  const handleAddReply = (index, replyText) => {
    if (!replyText.trim()) return;

    const updated = [...reflections];
    updated[index].replies.push({ 
      author: currentUser, 
      text: replyText,
      timestamp: new Date().toLocaleString(), // timestamp
    });
    saveReflections(updated);
  };

  const handleDeleteReflection = (index) => {
    const updated = [...reflections];
    updated.splice(index, 1);
    saveReflections(updated);
  };

  const leftReflections = reflections.filter((r) => r.author === partner);
  const rightReflections = reflections.filter((r) => r.author === currentUser);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 px-4 py-10 gap-8">
      <h1 className="text-5xl font-[Dancing_Script] text-pink-600 drop-shadow-md">
        {currentUser}'s Reflection
      </h1>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 flex flex-col gap-4">
        <div className="flex gap-4 text-2xl justify-center">
          {["😀", "😔", "😡", "😌", "😢"].map((emoji) => (
            <button
              key={emoji}
              className={`p-2 rounded-xl ${selectedEmoji === emoji ? "bg-pink-200" : ""}`}
              onClick={() => setSelectedEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg resize-none"
          placeholder="Explain why you selected this emoji..."
          value={reflectionInput}
          onChange={(e) => setReflectionInput(e.target.value)}
        />
        <button
          onClick={handleSubmitReflection}
          className="bg-pink-600 text-white px-6 py-3 rounded-2xl hover:bg-pink-700 transition shadow-md w-max self-end"
        >
          Submit
        </button>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-4">
          {leftReflections.map((r, i) => (
            <ReflectionCard
              key={i}
              reflection={r}
              onReply={(text) => handleAddReply(reflections.findIndex(ref => ref === r), text)}
              onDelete={() => handleDeleteReflection(reflections.findIndex(ref => ref === r))}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-4 items-end">
          {rightReflections.map((r, i) => (
            <ReflectionCard
              key={i}
              reflection={r}
              onReply={(text) => handleAddReply(reflections.findIndex(ref => ref === r), text)}
              onDelete={() => handleDeleteReflection(reflections.findIndex(ref => ref === r))}
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

const ReflectionCard = ({ reflection, onReply, onDelete }) => {
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(replyText);
    setReplyText("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 relative border-2 border-pink-300 max-w-md">
      <span className="font-semibold text-pink-600">{reflection.author} is feeling:</span>
      <p className="text-2xl">{reflection.emoji}</p>
      <p>{reflection.text}</p>
      <div className="text-xs text-gray-500 mt-1">{reflection.timestamp}</div>

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
      >
        ×
      </button>

      <div className="flex flex-col gap-2 mt-2">
        {reflection.replies.map((reply, i) => (
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
