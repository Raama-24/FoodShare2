// volunteer.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db, auth } from "../firebase";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";


import {  collection, query,  where,  doc,  updateDoc,  onSnapshot,  getDoc, addDoc, serverTimestamp } from "firebase/firestore";

import {  ArrowLeft,  MapPin,  Clock,  Users,  Leaf,  Filter,  Zap, Bell,  CheckCircle, Trash2,} from "lucide-react";

export default function Volunteer() {
  const navigate = useNavigate();

  // Theme (exact hex values you provided)
  const theme = {
    primary: "#8BC34A",
    primaryDark: "#689F38",
    background: "#F1F8E9",
    brown: "#795548",
    text: "#263238",
  };

  // === Your original states & logic (kept intact) ===
  const [filterType, setFilterType] = useState("all");
  const [donations, setDonations] = useState([]); // Pending donations (original real-time fetch)
  const [selectedDonation, setSelectedDonation] = useState("");
  const [user, setUser] = useState(null);

  // === Additional UI states (minimal, non-destructive) ===
  const [activeTab, setActiveTab] = useState("available"); // Available, active, history, notifications
  const [activeOrders, setActiveOrders] = useState([]); // Accepted by this volunteer
  const [completedOrders, setCompletedOrders] = useState([]); // Completed assignments for this volunteer
  const [notifications, setNotifications] = useState([]); // Simple notifications list

  const [userData, setUserData] = useState(null);
const [verificationMessage, setVerificationMessage] = useState("");

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [ngos, setNgos] = useState([]);
const [joinRequests, handleJoinRequests] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!user) return;

  const fetchVerification = async () => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setUserData(data);

      if (data.verified === "pending") {
        setVerificationMessage("Your ID verification is pending. You can still view donors but cannot complete pickups.");
      }

      if (data.verified === "rejected") {
        setVerificationMessage("Your ID was rejected. Contact admin.");
      }
    }
  };

  fetchVerification();
}, [user]);


  // CHECK LOGIN (unchanged)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((curr) => {
      if (!curr) {
        alert("You must be logged in to view donations!");
        navigate("/login");
      } else {
        setUser(curr);
      }
    });

    return unsubscribe;
  }, [navigate]);

    // REAL-TIME DONATIONS FETCH (unchanged - Pending only)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "donations"),
      where("status", "==", "Pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      // EXCLUDE OWN DONATIONS (keeps your original logic)
      const notMine = list.filter((d) => d.donorId !== user.uid);

      setDonations(notMine);

      // Push simple notifications for new pending donations
      // (keeps original query untouched; notification creation here is UI-only)
      const newNotes = snapshot.docs
        .filter((docSnap) => docSnap.metadata.hasPendingWrites === false)
        .map((d) => ({
          id: d.id,
          title: `New donation: ${d.data().foodName || "Food"}`,
          time: new Date().toLocaleString(),
        }));
      if (newNotes.length)
        setNotifications((n) => [...newNotes, ...n].slice(0, 10));
    });

    return unsubscribe;
  }, [user]);

  // ADDITIONAL: Active orders (Accepted by this volunteer)
  useEffect(() => {
    if (!user) return;

    const qAccepted = query(
      collection(db, "donations"),
      where("status", "==", "Accepted"),
      where("volunteerId", "==", user.uid)
    );

    const unsubAcc = onSnapshot(qAccepted, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setActiveOrders(list);
    });

    return unsubAcc;
  }, [user]);

  // ADDITIONAL: Completed orders (history)
  useEffect(() => {
    if (!user) return;

    const qCompleted = query(
      collection(db, "donations"),
      where("status", "==", "Completed"),
      where("volunteerId", "==", user.uid)
    );

    const unsubComp = onSnapshot(qCompleted, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCompletedOrders(list);
    });

    return unsubComp;
  }, [user]);

  // FILTERED LIST (same logic, but used in UI)
  const filteredDonations =
    filterType === "all"
      ? donations
      : donations.filter((d) => d.type === filterType);

  // ACCEPT DONATION (keeping your function intact, only small UI nicety: setSelectedDonation)
  const handleAccept = async (id) => {
    if (!user) return;

    setSelectedDonation(id);

    try {
      const ref = doc(db, "donations", id);
      const snap = await getDoc(ref);

      // DOUBLE-ACCEPT PREVENTION (kept exactly)
      if (snap.exists() && snap.data().status !== "Pending") {
        alert("This donation has already been accepted!");
        return;
      }

      await updateDoc(ref, {
        status: "Accepted",
        volunteerId: user.uid,
        volunteerName: user.displayName || "Volunteer",
        acceptedAt: new Date(),
      });

      alert("You have successfully accepted this donation!");
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept donation, try again.");
    } finally {
      setSelectedDonation("");
    }
  };

  // MARK COMPLETED helper (will set status to Completed in DB)
  const markDelivered = async (id) => {
    try {
      const ref = doc(db, "donations", id);
      await updateDoc(ref, {
        status: "Completed",
        completedAt: new Date(),
      });
      alert("Marked as delivered.");
    } catch (err) {
      console.error("Mark delivered error:", err);
      alert("Failed to mark delivered.");
    }
  };

  // Cancel / remove volunteer from an accepted order (optional UI action)
  const cancelAcceptance = async (id) => {
    try {
      const ref = doc(db, "donations", id);
      await updateDoc(ref, {
        status: "Pending",
        volunteerId: "",
        volunteerName: "",
        acceptedAt: null,
      });
      alert("Order returned to pending.");
    } catch (err) {
      console.error("Cancel acceptance error:", err);
      alert("Failed to cancel acceptance.");
    }
  };

  const openMap = (address) => {
    setSelectedAddress(address);
    setIsMapOpen(true);
  };

useEffect(() => {
  if (!user) return;

  const q = query(
    collection(db, "users"),
    where("role", "==", "ngo"),
    where("verified", "==", true)
  );

  // <-- PASTE DEBUGGING STEP HERE
  const unsub = onSnapshot(
    q,
    (snap) => {
      const ngosData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNgos(ngosData);
      setLoading(false);
    },
    (error) => {
      console.error("Error loading NGOs:", error);
      setLoading(false);
    }
  );

  return () => unsub();
}, [user]);


const handleJoinRequest = async (ngoId) => {
  if (!user) return;

  try {
    const volunteerRef = doc(db, "users", user.uid);
    const volunteerSnap = await getDoc(volunteerRef);
  

    if (!volunteerSnap.exists()) {
      console.log("No volunteer doc found");
      return;
    }

    const volunteer = volunteerSnap.data();

    const payload = {
      ngoId,
      volunteerId: user.uid,

      volunteerName: volunteer.name || "",
      volunteerEmail: volunteer.email || "",
      volunteerPhone: volunteer.phone || "",
      volunteerAddress: volunteer.address || "",
      

      status: "pending",
      createdAt: serverTimestamp(),
    };

    console.log("SENDING REQUEST:", payload);

    await addDoc(collection(db, "ngo_join_requests"), payload);

    alert("Request sent!");
  } catch (err) {
    console.error(err);
  }
};

  // UI helpers
  const countPending = filteredDonations.length;
  const countActive = activeOrders.length;
  const countHistory = completedOrders.length;
  const countNotifs = notifications.length;

  // ---------- RENDER ----------
  return (

    
    <div
      style={{ background: theme.background }}
      className="min-h-screen flex flex-col"
    >
      <Header />

      <Dialog
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-4 w-[90%] max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Donor Location</h2>
              <button onClick={() => setIsMapOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Map Embed */}
            <iframe
              width="100%"
              height="300"
              loading="lazy"
              allowFullScreen
              style={{ borderRadius: "10px" }}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                selectedAddress
              )}&output=embed`}
            ></iframe>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                selectedAddress
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg">
                Navigate in Google Maps
              </button>
            </a>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 style={{ color: theme.text }} className="text-3xl font-bold">
              Welcome , {user?.displayName || user?.name }
              </h1>
              <p style={{ color: theme.text }} className="text-sm mt-1">
                Find donations near you, accept pickups, and manage your
                deliveries.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
                style={{
                  border: `2px solid ${theme.primary}`,
                  background: "transparent",
                  color: theme.text,
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div
                className="px-4 py-2 rounded-lg font-semibold flex items-center gap-3"
                style={{
                  background: theme.primary,
                  color: "#ffffff",
                }}
              >
                <Bell className="w-5 h-5" />
                <span>{countNotifs}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {[
              { id: "available", label: `Available Orders (${countPending})` },
              { id: "active", label: `Active Pickups (${countActive})` },
              { id: "history", label: `History (${countHistory})` },
              { id: "notifications", label: `Notifications (${countNotifs})` },
                 { id: "join_ngo", label: "Join NGO" },
                 { id: "donation_drive", label: "Donation Drive" },
                 
        
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl font-bold transition whitespace-nowrap`}
                style={
                  activeTab === tab.id
                    ? {
                        background: theme.primary,
                        color: "#ffffff",
                        boxShadow: `0 6px 18px ${theme.primaryDark}22`,
                      }
                    : {
                        background: "#ffffff",
                        color: theme.text,
                        border: `1px solid ${theme.primary}`,
                      }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT: Available */}
          {activeTab === "available" && (
            <div className="space-y-6">
              {/* Filter block */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "#ffffff",
                  border: `1px solid ${theme.primaryDark}33`,
                }}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: theme.text }}
                    >
                      Search by city / area
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city or area..."
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        background: theme.background,
                        border: `1px solid ${theme.primaryDark}22`,
                        color: theme.text,
                      }}
                      // NOTE: kept purely UI — filtering uses filterType + your Firestore data
                    />
                  </div>

                  <div style={{ minWidth: 180 }}>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: theme.text }}
                    >
                      Food type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        background: theme.background,
                        border: `1px solid ${theme.primaryDark}22`,
                        color: theme.text,
                      }}
                    >
                      <option value="all">All</option>
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-veg</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        /* Search is UI-only; your real-time query already fetches pending donations */
                        // No logic changes to Firestore queries here.
                      }}
                      className="px-6 py-3 rounded-lg font-bold w-full"
                      style={{
                        background: theme.primary,
                        color: "#fff",
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Donations list (from your original pending donations state) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className={`rounded-2xl p-6 transition cursor-pointer border-2`}
                      onClick={() => setSelectedDonation(donation.id)}
                      style={{
                        background: "#ffffff",
                        borderColor:
                          selectedDonation === donation.id
                            ? theme.primary
                            : "#E6E6E6",
                        boxShadow:
                          selectedDonation === donation.id
                            ? `0 10px 30px ${theme.primary}22`
                            : "none",
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="text-4xl">🍲</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3
                                  className="text-lg font-bold"
                                  style={{ color: theme.text }}
                                >
                                  {donation.foodName || donation.food || "Food"}
                                </h3>
                                {donation.verified && (
                                  <span
                                    className="text-xs px-2 py-1 rounded-full font-semibold"
                                    style={{
                                      background: `${theme.primary}22`,
                                      color: theme.primaryDark,
                                    }}
                                  >
                                    ✓ Verified
                                  </span>
                                )}
                              </div>

                              <p
                                className="text-sm mt-1"
                                style={{ color: theme.brown }}
                              >
                                From:{" "}
                                <span
                                  className="font-medium"
                                  style={{ color: theme.text }}
                                >
                                  {donation.donorName ||
                                    donation.donor ||
                                    donation.donorName}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* grid details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <Users
                                className="w-4 h-4"
                                style={{ color: theme.primary }}
                              />
                              <div>
                                <p
                                  className="text-xs"
                                  style={{ color: theme.brown }}
                                >
                                  Meals
                                </p>
                                <p
                                  className="font-semibold"
                                  style={{ color: theme.text }}
                                >
                                  {donation.meals || donation.quantity || "-"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin
                                className="w-4 h-4"
                                style={{ color: theme.primary }}
                              />
                              <div>
                                <p
                                  className="text-xs"
                                  style={{ color: theme.brown }}
                                >
                                  City
                                </p>
                                <p
                                  className="font-semibold"
                                  style={{ color: theme.text }}
                                >
                                  {donation.pickupCity ||
                                    donation.address ||
                                    "-"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock
                                className="w-4 h-4"
                                style={{ color: "#F59E0B" }}
                              />
                              <div>
                                <p
                                  className="text-xs"
                                  style={{ color: theme.brown }}
                                >
                                  Expires
                                </p>
                                <p
                                  className="font-semibold"
                                  style={{ color: theme.text }}
                                >
                                  {donation.expiresBy?.toDate
                                    ? donation.expiresBy
                                        .toDate()
                                        .toLocaleString()
                                    : donation.expiresIn ||
                                      donation.expiresBy ||
                                      "-"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Leaf
                                className="w-4 h-4"
                                style={{ color: theme.primary }}
                              />
                              <div>
                                <p
                                  className="text-xs"
                                  style={{ color: theme.brown }}
                                >
                                  Type
                                </p>
                                <p
                                  className="font-semibold capitalize"
                                  style={{ color: theme.text }}
                                >
                                  {donation.type || "-"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex items-center gap-2 text-sm"
                            style={{ color: theme.brown }}
                          >
                            <MapPin className="w-4 h-4" />
                            <p>
                              {donation.pickupAddress ||
                                donation.address ||
                                "-"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {/* Accept Button */}
                          <button
                            onClick={() => handleAccept(donation.id)}
                            disabled={donation.status !== "Pending"}
                            className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                            style={{
                              background:
                                donation.status === "Pending"
                                  ? theme.primary
                                  : "#e5e5e5",
                              color:
                                donation.status === "Pending" ? "#fff" : "#777",
                            }}
                          >
                            <Zap className="w-4 h-4" />
                            {donation.status === "Pending"
                              ? "Accept"
                              : "Claimed"}
                          </button>

                          {/* View Map Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAddress(
                                donation.pickupAddress || donation.address
                              );
                              setIsMapOpen(true);
                            }}
                            className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                            style={{
                              background: "#2563eb",
                              color: "#fff",
                            }}
                          >
                            <MapPin className="w-4 h-4" />
                            View Map
                          </button>

                          {/* View Details Button */}
                          <button
                            onClick={() => alert("View details coming soon")}
                            className="px-6 py-2 border rounded-lg text-sm"
                            style={{
                              borderColor: `${theme.primary}44`,
                              color: theme.text,
                              background: "#fff",
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl text-center">
                    <p style={{ color: theme.brown }}>
                      No donations available with selected filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CONTENT: Active Pickups */}
          {activeTab === "active" && (
            <div className="space-y-6">
              <h2 style={{ color: theme.text }} className="text-2xl font-bold">
                Your Active Pickups ({activeOrders.length})
              </h2>

              {activeOrders.length === 0 && (
                <div className="bg-white p-6 rounded-xl text-center">
                  <p style={{ color: theme.brown }}>
                    You have no active pickups right now.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-6 border"
                    style={{ borderColor: `${theme.primary}33` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3
                          style={{ color: theme.text }}
                          className="text-xl font-bold"
                        >
                          {order.foodName || order.food}
                        </h3>
                        <p className="text-sm" style={{ color: theme.brown }}>
                          From: {order.donorName || order.donor}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-lg font-bold"
                        style={{
                          background: `${theme.primary}22`,
                          color: theme.primaryDark,
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* details row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs" style={{ color: theme.brown }}>
                          Distance
                        </p>
                        <p className="font-bold" style={{ color: theme.text }}>
                          {order.distance || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: theme.brown }}>
                          ETA
                        </p>
                        <p className="font-bold" style={{ color: theme.text }}>
                          {order.eta || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: theme.brown }}>
                          Accepted
                        </p>
                        <p
                          className="font-bold text-sm"
                          style={{ color: theme.text }}
                        >
                          {order.acceptedAt
                            ? new Date(
                                order.acceptedAt.seconds * 1000
                              ).toLocaleString()
                            : order.time || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: theme.brown }}>
                          Temp
                        </p>
                        <p className="font-bold" style={{ color: theme.text }}>
                          {order.temp || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        className="px-4 py-3 border rounded-lg font-bold flex items-center justify-center gap-2"
                        style={{ borderColor: theme.primary }}
                      >
                        Call Donor
                      </button>
                      <button
                        className="px-4 py-3 border rounded-lg font-bold"
                        style={{ borderColor: "#ddd" }}
                      >
                        View Map
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => markDelivered(order.id)}
                          className="flex-1 px-4 py-3 rounded-lg font-bold"
                          style={{ background: "#34D399", color: "#fff" }}
                        >
                          <CheckCircle className="w-4 h-4 inline" /> Mark
                          Delivered
                        </button>

                        <button
                          onClick={() => cancelAcceptance(order.id)}
                          className="px-3 py-3 rounded-lg font-bold border"
                          style={{
                            borderColor: `${theme.brown}55`,
                            color: theme.brown,
                          }}
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTENT: History */}
          {activeTab === "history" && (
            <div>
              <h2
                style={{ color: theme.text }}
                className="text-2xl font-bold mb-4"
              >
                Completed Orders
              </h2>
              <div className="space-y-4">
                {completedOrders.length === 0 && (
                  <div className="bg-white p-6 rounded-xl text-center">
                    <p style={{ color: theme.brown }}>
                      No completed orders yet.
                    </p>
                  </div>
                )}

                {completedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-xl border"
                    style={{ borderColor: `${theme.primary}22` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold" style={{ color: theme.text }}>
                          {order.foodName || order.food}
                        </h3>
                        <p className="text-sm" style={{ color: theme.brown }}>
                          From: {order.donorName || order.donor}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="inline-block px-3 py-1 rounded-lg"
                          style={{
                            background: `${theme.primary}22`,
                            color: theme.primaryDark,
                          }}
                        >
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Completed
                        </span>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: theme.primaryDark, marginTop: 8 }}
                        >
                          {order.completedAt
                            ? new Date(
                                order.completedAt.seconds * 1000
                              ).toLocaleDateString()
                            : order.completed || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTENT: Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h2
                style={{ color: theme.text }}
                className="text-2xl font-bold mb-4"
              >
                Notifications
              </h2>

              <div className="space-y-3">
                {notifications.length === 0 && (
                  <div className="bg-white p-6 rounded-xl text-center">
                    <p style={{ color: theme.brown }}>No notifications yet.</p>
                  </div>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id + n.time}
                    className="bg-white p-4 rounded-xl flex items-center justify-between"
                    style={{ border: `1px solid ${theme.primary}11` }}
                  >
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: theme.text }}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs" style={{ color: theme.brown }}>
                        {n.time}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.filter((x) => x.id !== n.id)
                        )
                      }
                      className="px-3 py-2 rounded-lg font-bold"
                      style={{
                        border: `1px solid ${theme.brown}33`,
                        color: theme.brown,
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            </div>            
          )}

 {/* CONTENT: Join NGO */}
         {activeTab === "join_ngo" && (
  <div className="mt-6">
    {loading ? (
      <p style={{ color: theme.brown }}>Loading NGOs...</p>
    ) : ngos.length === 0 ? (
      <p style={{ color: theme.brown }}>No NGOs available</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ngos.map((ngo) => (
          <div
            key={ngo.id}
            className="p-6 rounded-xl"
            style={{
              background: "#ffffff",
              border: `1px solid ${theme.primaryDark}33`,
            }}
          >
            <h3 className="font-bold text-lg" style={{ color: theme.text }}>
              {ngo.name}
            </h3>

            <p className="text-sm mt-1" style={{ color: theme.brown }}>
              {ngo.email}
            </p>

            <p className="text-sm" style={{ color: theme.brown }}>
              {ngo.phone}
            </p>

            <button
              onClick={() => handleJoinRequest(ngo.id)}
              className="mt-4 px-6 py-2 rounded-lg font-semibold"
              style={{ background: theme.primary, color: "#fff" }}
            >
              Request to Join
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)}

          {/* CONTENT: Donation Drive */}
          {activeTab === "donation_drive" && (
    <div className="bg-white p-6 rounded-lg border">
      <Link
              to="/donation-drive"
              className="px-8 py-3 bg-primary text-green-500 rounded-lg font-semibold hover:bg-primary-600 transition">
            
             View Donation Drives
            </Link>    
        </div>
          )}
      </div>
    </div>
   </div>
  );
}


