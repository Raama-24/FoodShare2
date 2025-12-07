import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import {  collection,  query,  where,  doc,  updateDoc,  onSnapshot,  getDocs,  serverTimestamp,} from "firebase/firestore";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {  MapPin,  Calendar,  Clock,  X,  Phone,  Mail,  Leaf,  User,} from "lucide-react";
import Layout from "./ngoLayout";

import {  LayoutDashboard,  Heart,  Users,  ClipboardList,  ArrowLeft,  ChevronDown,} from "lucide-react";

// ------------------- DonationCard Component -------------------
export function DonationCard({ donation, onAccept, onView }) {
  const statusColors = {
    Pending: "bg-[#FFF9C4] text-[#F57F17] border-[#FFF59D]",
    Assigned: "bg-[#BBDEFB] text-[#1565C0] border-[#90CAF9]",
    Completed: "bg-[#C8E6C9] text-[#2E7D32] border-[#A5D6A7]",
  };

  const status = donation.status || "Pending";

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-[#263238] mb-1">
            {donation.foodName || donation.food || "-"}
          </h3>
          <p className="text-[#795548]">
            {donation.meals ? `${donation.meals} meals` : "-"}
          </p>
        </div>
        <Badge className={statusColors[status]} variant="outline">
          {status}
        </Badge>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4 text-[#795548]">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{donation.pickupCity || donation.city || "-"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {donation.postedAt?.toDate
              ? donation.postedAt.toDate().toLocaleDateString()
              : donation.postedAt || "-"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            Expires:{" "}
            {donation.expiresBy?.toDate
              ? donation.expiresBy.toDate().toLocaleString()
              : donation.expiresBy || "-"}
          </span>
        </div>
      </div>

      {/* Actions */}

      <div className="flex gap-2">
        {status === "Pending" && onAccept && (
          <Button
            size="sm"
            onClick={() => onAccept(donation.id)}
            className="bg-[#689F38] hover:bg-[#558B2F]"
          >
            Accept
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onView(donation)}>
          View
        </Button>
      </div>
    </Card>
  );
}

// ------------------- DonationDetailPanel Component -------------------
export function DonationDetailPanel({
  donation,
  open,
  onClose,
  members,
  onAssignMember,
  onViewMembers,
}) {
  const [selectedMember, setSelectedMember] = useState("");

  const theme = {
    primary: "#8BC34A",
    brown: "#795548",
    text: "#263238",
  };

  if (!open || !donation) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
      <div className="bg-white w-full md:w-96 p-6 overflow-y-auto relative">
        {/* Header */}
        <h3 className="text-lg font-bold mb-3" style={{ color: theme.text }}>
          Donation Details
        </h3>

        {/* Food Info */}
        <h4 className="font-semibold mb-1" style={{ color: theme.text }}>
          {donation.foodName || donation.food}
        </h4>
        <p className="text-sm mb-1" style={{ color: theme.brown }}>
          Donor: {donation.donorName || donation.donor || "-"}
        </p>
        <p className="text-sm mb-1">
          Address: {donation.pickupAddress || donation.address || "-"}
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Posted:{" "}
          {donation.postedAt?.toDate
            ? donation.postedAt.toDate().toLocaleString()
            : donation.postedAt || "-"}
        </p>

        {/* Assign Volunteer */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">
            Assign Volunteer
          </label>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border mb-3"
          >
            {volunteers.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name || v.displayName} —
                {v.activeAssignments === 0
                  ? "Available"
                  : `Busy (${v.activeAssignments})`}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onAssignMember(donation.id, selectedMember);
                setSelectedMember("");
              }}
              className="flex-1 px-4 py-2 rounded-lg font-bold"
              style={{ background: theme.primary, color: "#fff" }}
              disabled={!selectedMember}
            >
              Assign
            </button>

            <button
              onClick={onViewMembers}
              className="flex-1 px-4 py-2 rounded-lg font-semibold border"
              style={{ borderColor: theme.primary }}
            >
              View Members
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 underline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------- Main NgoDashboard -------------------
export default function NgoDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [pendingDonations, setPendingDonations] = useState([]);
  const [assignedDonations, setAssignedDonations] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);

  const theme = {
    primary: "#8BC34A",
    primaryDark: "#689F38",
    background: "#F1F8E9",
    brown: "#795548",
    text: "#263238",
  };

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) navigate("/login");
      else setUser(u);
    });
    return unsub;
  }, [navigate]);

  // Fetch volunteers
  useEffect(() => {
    const fetchVols = async () => {
      const volSnap = await getDocs(collection(db, "users"));

      // 👉 Use donations list already loaded in this component
      const vols = volSnap.docs.map((v) => {
        const volunteerId = v.id;

        // Count active (not completed) assigned donations
        const activeAssignments = donations.filter(
          (d) => d.assignedVolunteer === volunteerId && d.status !== "Completed"
        ).length;

        return {
          id: volunteerId,
          activeAssignments,
          ...v.data(),
        };
      });
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "volunteer")
        );
        const snap = await getDocs(q);
        setVolunteers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      }
    };
    fetchVols();
  }, []);

  // Realtime donations
  useEffect(() => {
    if (!user) return;
    const pendingQ = query(
      collection(db, "donations"),
      where("status", "==", "Pending")
    );
    const unsubPending = onSnapshot(pendingQ, (snap) => {
      setPendingDonations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const assignedQ = query(
      collection(db, "donations"),
      where("ngoId", "==", user.uid)
    );
    const unsubAssigned = onSnapshot(assignedQ, (snap) => {
      const assigned = [];
      const completed = [];
      snap.forEach((d) => {
        const data = { id: d.id, ...d.data() };
        if (data.status === "Completed" || data.status === "completed")
          completed.push(data);
        else assigned.push(data);
      });
      setAssignedDonations(assigned);
      setCompletedDonations(completed);
    });

    return () => {
      unsubPending();
      unsubAssigned();
    };
  }, [user]);

  const acceptDonation = async (donationId) => {
    const ref = doc(db, "donations", donationId);
    await updateDoc(ref, {
      status: "Assigned",
      ngoId: user.uid,
      ngoName: user.displayName || user.name,
      ngoCity: user.city || "",
      ngoAddress: user.address || "",
      acceptedAt: serverTimestamp(),
    });
    toast.success("Donation accepted");
  };

  const assignVolunteer = async (donationId, volunteerId) => {
    const ref = doc(db, "donations", donationId);
    await updateDoc(ref, {
      volunteerId,
      assignedVolunteer: volunteerId,
      status: "Assigned",
      assignedAt: serverTimestamp(),
    });
    toast.success("Volunteer assigned");
    setDetailOpen(false);
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "ngo_join_requests"),
      where("ngoId", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsub = onSnapshot(q, (snap) => {
      setJoinRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  const allDonations = [
    ...pendingDonations,
    ...assignedDonations,
    ...completedDonations,
  ];

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#263238]">NGO Dashboard</h1>
          <p className="text-sm mt-1 text-[#795548]">
            Manage donations, assign volunteers and track deliveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDonations.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-[rgba(121,85,72,0.15)]">
              <p className="text-[#795548]">No donations found</p>
            </div>
          )}
          {allDonations.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              onAccept={acceptDonation}
              onView={(d) => {
                setSelectedDonation(d);
                setDetailOpen(true);
              }}
            />
          ))}
        </div>

        <DonationDetailPanel
          donation={selectedDonation}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          members={volunteers}
          onAssignMember={assignVolunteer}
          onViewMembers={() => setActiveTab("members")}
        />
      </div>
    </Layout>
  );
}
