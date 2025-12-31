import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Leaf, ArrowLeft } from "lucide-react";

import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

import {
  Heart,
  TrendingUp,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [verified, setVerified] = useState(null); // ✅ NEW

  // Auth check & fetch Firestore user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (curr) => {
      if (!curr) {
        alert("Please login first");
        navigate("/login");
      } else {
        setUser(curr);

        // FETCH VERIFIED STATUS FROM FIRESTORE
        const snap = await getDoc(doc(db, "users", curr.uid));
        const data = snap.data();
        setUser({
          uid: curr.uid,
          email: curr.email,
          ...data, // Now name, phone, role etc come from Firestore
        });

        setVerified(data?.verified ?? false);
      }
    });
    return unsubscribe;
  }, [navigate]);

  // Real-time donations listener
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "donations"),
      where("donorId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDonations(list);
    });

    return unsub;
  }, [user]);

  // Real-time notifications listener
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(list);
    });

    return unsub;
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- DONOR DASHBOARD ----------------

  const DonorDashboard = () => (
    <div className="space-y-6">
      {/* 🔥 VERIFICATION BANNER */}
      {verified === false && (
        <div className="p-4 bg-[#F1F8E9] border border-[#795548] text-[#795548] rounded-lg">
          <strong>Your account is under review.</strong>
          An admin will verify your identity soon. You cannot post donations
          until verification.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Active Donations</p>
              <p className="text-3xl font-bold text-foreground">
                {donations.length}
              </p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Meals Rescued</p>
              <p className="text-3xl font-bold text-foreground">
                {donations.reduce((acc, d) => acc + (d.meals || 0), 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Volunteer Pickups</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-border">
        {["overview", "post", "history", "notifications", "Donation-Drive"].map(
          (tab) => (
            /* 🔥 If user NOT verified, DISABLE “Post” tab */
            <button
              key={tab}
              onClick={() => {
                if (tab === "post" && verified === false) return;
                setActiveTab(tab);
              }}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } ${
                tab === "post" && verified === false
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">
        {activeTab === "post" && verified === false && (
          <div className="text-center text-red-600 font-semibold bg-red-50 p-4 rounded-lg">
            🚫 You cannot post donations until admin verifies your account.
          </div>
        )}

        {/* If verified → normal post donation UI */}
        {activeTab === "post" && verified === true && (
          <div className="bg-white p-8 rounded-lg border text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Post New Donation
            </h2>
            <p className="text-muted-foreground mb-6">
              Share your surplus food with verified volunteers
            </p>
            <Link
              to="/post-donation"
              className="px-8 py-3 bg-[#8BC34A] text-white rounded-lg font-semibold hover:bg-[#558B2F] transition"
            >
              Create Donation Post
            </Link>
          </div>
        )}
      </div>

      {activeTab === "overview" && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-3">Overview</h2>
          <p className="text-muted-foreground">
            Your donation activity summary.
          </p>
        </div>
      )}

      {/* ---------------- HISTORY TAB ---------------- */}
      {activeTab === "history" && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-3">Donation History</h2>

          {donations.length === 0 ? (
            <p className="text-muted-foreground">No donation history found.</p>
          ) : (
            <div className="space-y-4">
              {donations.map((d) => (
                <div key={d.id} className="p-4 border rounded-lg bg-gray-50">
                  <p>
                    <strong>Food:</strong> {d.foodName}
                  </p>
                  <p>
                    <strong>Meals:</strong> {d.meals}
                  </p>
                  <p>
                    <strong>Status:</strong> {d.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- NOTIFICATIONS TAB ---------------- */}
      {activeTab === "notifications" && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>

          {notifications.length === 0 ? (
            <p className="text-muted-foreground">No notifications yet.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 border rounded-lg bg-gray-50">
                  <p>{n.message}</p>
                  <p className="text-sm text-muted-foreground">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Donation-Drive" && (
        <div className="bg-white p-6 rounded-lg border">
          <Link
            to="/Donation-Drive"
            className="px-8 py-3 bg-primary text-green-500 rounded-lg font-semibold hover:bg-primary-600 transition"
          >
            Create Donation Post
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-[#F1F8E9]">
        <div className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-[#795548]">
                  Welcome back, {user?.name || "User"}!
                </h1>
                <p className="text-[#263238]/70">
                  Manage your food donations and track volunteer pickups
                </p>
              </div>

              {/* Back Button - Right aligned */}
              <button
                onClick={() => handleLogout()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:bg-[#E8F5E9]"
                style={{
                  border: "2px solid #795548",
                  background: "transparent",
                  color: "#263238",
                  whiteSpace: "nowrap",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            {/* Dashboard Section */}
            <DonorDashboard />
          </div>
        </div>
      </div>
    </>
  );
}
