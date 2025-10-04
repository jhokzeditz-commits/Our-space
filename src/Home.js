import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleLoginClick = (userName) => {
    setSelectedUser(userName);
    setPasscode("");
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const correctPasscode =
      selectedUser === "James" ? "SultanRS" : "Carter";

    if (passcode === correctPasscode) {
      setModalOpen(false);
      navigate(`/user/${selectedUser}`);
    } else {
      setError("Oops! Wrong passcode. Try again.");
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 gap-12">
      <h1 className="text-6xl font-[Dancing_Script] text-pink-600 drop-shadow-md">
        🌸 Our Space 🌸
      </h1>

      <div className="flex gap-8">
        <button
          onClick={() => handleLoginClick("James")}
          className="bg-pink-600 text-white px-6 py-3 rounded-2xl hover:bg-pink-700 shadow-md text-xl"
        >
          James
        </button>

        <button
          onClick={() => handleLoginClick("Ari")}
          className="bg-purple-600 text-white px-6 py-3 rounded-2xl hover:bg-purple-700 shadow-md text-xl"
        >
          Ari
        </button>
      </div>

      {/* Password Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md flex flex-col gap-4 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">
              Enter Passcode for {selectedUser}
            </h2>

            <input
              type="password"
              placeholder="Secret passcode..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg"
            />

            {error && (
              <span className="text-red-500 font-semibold">{error}</span>
            )}

            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={handleClose}
                className="bg-gray-300 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
