import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db, auth } from "../firebase";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function NgoPost() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    title: "",
    meals: "",
    type: "veg",
    city: "",
    address: "",
    description: "",
    deadline: "",
  });

  // CHECK LOGIN + ROLE
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((curr) => {
      if (!curr) {
        alert("Please login first");
        navigate("/login");
      } else {
        setUser(curr);
      }
    });

    return unsub;
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.meals ||
      !form.city ||
      !form.address ||
      !form.deadline
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "ngoRequests"), {
        ...form,
        meals: Number(form.meals),
        deadline: new Date(form.deadline),
        ngoId: user.uid,
        ngoName: user.displayName || "NGO",
        status: "Open",
        createdAt: serverTimestamp(),
      });

      alert("Request posted successfully!");
      navigate("/ngo-dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to post request");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8E9]">
      <Header />

      <div className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-2xl">

          {/* Back Button */}
          <button
            onClick={() => navigate("/ngo-dashboard")}
            className="flex items-center gap-2 text-[#689F38] font-semibold mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#263238] mb-6">
            Create New NGO Request
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-[#8BC34A] rounded-xl p-8 shadow-sm"
          >
            {/* Title */}
            <div className="mb-4">
              <label className="block font-semibold text-[#263238] mb-1">
                Request Title *
              </label>
              <input
                type="text"
                name="title"
                className="w-full border rounded-lg p-2 bg-[#F1F8E9] focus:outline-[#8BC34A]"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            {/* Meals */}
            <div className="mb-4">
              <label className="block font-semibold text-[#263238] mb-1">
                Meals Needed *
              </label>
              <input
                type="number"
                name="meals"
                className="w-full border rounded-lg p-2 bg-[#F1F8E9]"
                value={form.meals}
                onChange={handleChange}
              />
            </div>

            {/* Type */}
            <div className="mb-4">
              <label className="block font-semibold text-[#263238] mb-1">
                Food Type *
              </label>
              <select
                name="type"
                className="w-full border rounded-lg p-2 bg-[#F1F8E9]"
                value={form.type}
                onChange={handleChange}
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* City */}
            <div className="mb-4">
              <label className="block font-semibold text-[#263238] mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                className="w-full border rounded-lg p-2 bg-[#F1F8E9]"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block font-semibold text-[#263238] mb-1">
                Address *
              </label>
              <textarea
                name="address"
                className="w-full border rounded-lg p-2 bg-[#F1F8E9]"
                rows="2"
                value={form.address}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Deadline */}
            <div className="mb-4">
              <label className="block font-semibold text-[#263238] mb-1">
                Needed Before *
              </label>
              <input
                type="datetime-local"
                name="deadline"
                className="w-full border rounded-lg p-2 bg-[#F1F8E9]"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block font-semibold text-[#263238] mb-1">
                Description (optional)
              </label>
              <textarea
                name="description"
                className="w-full border rounded-lg p-2 bg-[#F1F8E9]"
                rows="3"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#8BC34A] text-white font-semibold py-3 rounded-lg hover:bg-[#689F38] transition"
            >
              <PlusCircle className="w-5 h-5" />
              Post Request
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
