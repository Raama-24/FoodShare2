import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));

      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        setError("Not an admin account");
        setLoading(false);
        return;
      }

      localStorage.setItem("userRole", "admin");

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8E9]">
      <Header />

      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-[#795548]">
          <h2 className="text-3xl font-black text-center text-[#263238] mb-6">
            Admin Login
          </h2>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-600 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              required
              className="w-full px-4 py-3 border border-[#263238]/40 bg-white rounded-lg"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-[#263238]/40 bg-white rounded-lg"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8BC34A] text-white rounded-lg font-bold hover:bg-[#689F38]"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
