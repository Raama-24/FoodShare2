
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function PostDonation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    type: "veg",
    preparedOn: "",
    expiresBy: "",
    pickupAddress: "",
    pickupCity: "",
    pickupZipCode: "",
    notes: "",
  });

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        alert("You must be logged in to post a donation!");
        navigate("/login");
      } else {
        setUser(currentUser);
      }
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, [navigate]);

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user info...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { foodName, quantity, expiresBy, pickupAddress, pickupCity } = formData;
    if (!foodName || !quantity || !expiresBy || !pickupAddress || !pickupCity) {
      return alert("Please fill all required fields");
    }

    if (!user) return alert("User not found. Please login again.");

    setLoadingSubmit(true);
    try {
      await addDoc(collection(db, "donations"), {
        donorId: user.uid,
        donorName: user.displayName || "Anonymous",
        foodName: formData.foodName,
        meals: Number(formData.quantity),
        type: formData.type,
        preparedOn: formData.preparedOn
          ? Timestamp.fromDate(new Date(formData.preparedOn))
          : null,
        expiresBy: Timestamp.fromDate(new Date(formData.expiresBy)),
        pickupAddress: formData.pickupAddress,
        pickupCity: formData.pickupCity,
        pickupZipCode: formData.pickupZipCode,
        notes: formData.notes,
        status: "Pending",
        postedAt: serverTimestamp(),
      });

      alert("Donation posted successfully!");
      navigate("/dashboard/donor");
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Failed to post donation. Check console.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={() => navigate("/dashboard/donor")}
            className="flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-xl p-8 border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Post Food Donation
            </h1>
            <p className="text-muted-foreground mb-8">
              Share your surplus food with verified volunteers in your area
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Food Details */}
              <div className="border-b border-border pb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Food Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Food Name / Item *
                  </label>
                  <input
                    type="text"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleInputChange}
                    placeholder="e.g., Pizza, Biryani, Sandwich"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quantity (Meals) *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="10"
                      min="1"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Prepared On
                    </label>
                    <input
                      type="datetime-local"
                      name="preparedOn"
                      value={formData.preparedOn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Expires By *
                    </label>
                    <input
                      type="datetime-local"
                      name="expiresBy"
                      value={formData.expiresBy}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any allergies, special instructions, etc."
                    rows={3}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="pb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Pickup Location
                </h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="pickupCity"
                      value={formData.pickupCity}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="pickupZipCode"
                      value={formData.pickupZipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="flex-1 py-3 bg-primary text-green-500 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 transition"
                >
                  {loadingSubmit ? "Posting..." : "Post Donation"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/donor")}
                  className="flex-1 py-3 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
