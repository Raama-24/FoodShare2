import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Create Firestore admin user
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: "admin",
        verified: true, // admin is always verified by default
        createdAt: serverTimestamp(),
      });

      setSuccess("Admin account created successfully!");

      // redirect admin
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8E9]">
      <Header />

      <div className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-4xl font-black text-[#263238] mb-6 text-center">
            Admin Sign Up
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#795548] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Admin Name"
                className="w-full px-4 py-3 border border-[#263238]/40 rounded-lg bg-white"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#795548] mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-[#263238]/40 rounded-lg bg-white"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#795548] mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 border border-[#263238]/40 rounded-lg bg-white"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#795548] mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-3 border border-[#263238]/40 rounded-lg bg-white"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-[#8BC34A] text-white rounded-lg font-bold hover:bg-[#689F38] disabled:opacity-50 shadow-lg"
            >
              {loading ? "Creating..." : "Create Admin Account"}
            </button>
          </form>

          {success && (
            <p className="mt-6 text-center text-[#8BC34A] font-semibold">
              {success}
            </p>
          )}

          <p className="mt-6 text-center">
            Already have an admin account?{" "}
            <button
              onClick={() => navigate("/admin/login")}
              className="text-[#8BC34A] font-bold"
            >
              Log in
            </button>
          </p>
        </div>
      </div>

     
    </div>
  );
}
