
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const API_URL = "http://localhost:5000";

  // Fetch pending users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/pendingUsers`);
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await axios.post(`${API_URL}/verifyUser`, { uid: id, verified: status });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error verifying user:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8E9]">

      <div className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-4xl font-black text-[#263238] mb-8 text-center">
          Admin Dashboard
        </h1>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white border border-[#795548] p-6 rounded-xl shadow"
            >
              <h2 className="text-xl font-bold text-[#263238]">{u.name}</h2>
              <p className="text-[#263238]/70">Email: {u.email}</p>
              <p className="text-[#263238]/70">Role: {u.role}</p>

              <p className="text-[#263238]/70">
                Status:{" "}
                <span
                  className={
                    u.verified
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {u.verified ? "Verified" : "Pending"}
                </span>
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleVerify(u.id, true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleVerify(u.id, false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <p className="text-center text-[#263238]/60 mt-10">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
