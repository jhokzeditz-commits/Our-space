import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserPage() {
  const navigate = useNavigate();
  const { userName } = useParams();

  // Determine partner dynamically
  const partner = userName === "James" ? "Ari" : "James";

  // Button text
  const improvementButtonText =
    userName === "James" ? "How I can improve" : "How James can improve";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 gap-12">
      {/* Page Title */}
      <h1 className="text-5xl font-[Dancing_Script] text-pink-600 drop-shadow-md mb-10">
        🌸 {userName}'s Space 🌸
      </h1>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() =>
            navigate(`/reflection/${userName}`, { state: { currentUser: userName, partner } })
          }
          className="bg-pink-600 text-white px-6 py-3 rounded-2xl hover:bg-pink-700 transition shadow-md text-xl"
        >
          Daily Reflection
        </button>

        <button
          onClick={() =>
            navigate(`/improvement/${userName}`, { state: { currentUser: userName, partner } })
          }
          className="bg-purple-600 text-white px-6 py-3 rounded-2xl hover:bg-purple-700 transition shadow-md text-xl"
        >
          {improvementButtonText}
        </button>

        <button
          onClick={() => navigate(`/testament/${userName}`)}
          className="bg-yellow-500 text-white px-6 py-3 rounded-2xl hover:bg-yellow-600 transition shadow-md text-xl"
        >
          James Testament
        </button>
      </div>
    </div>
  );
}
