import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator"; 
import { User, MapPin, Calendar, Check, X } from "lucide-react";
import Layout from "./ngoLayout";

export default function Request() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for auth state & fetch pending join requests
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const q = query(
        collection(db, "ngo_join_requests"),
        where("status", "==", "pending"),
        where("ngoId", "==", user.uid)
      );

      const unsubSnap = onSnapshot(q, (snap) => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("📡 Snapshot OK:", data);
        console.log("📌 REQUESTS FROM FIRESTORE:", data); 
        setRequests(data);
        setLoading(false);
      },[user]);

      return () => unsubSnap();
    });

    return () => unsubscribe();
  }, []);

  // Approve / Reject handlers
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "ngo_join_requests", id), { status: "approved" });
      alert("Volunteer approved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve volunteer.");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, "ngo_join_requests", id), { status: "rejected" });
      alert("Request rejected.");
    } catch (err) {
      console.error(err);
      alert("Failed to reject request.");
    }
  };

  if (loading) return <p className="text-[#795548]">Loading requests...</p>;

  return (
  <Layout>
    <div>
      <div className="mb-8">
        <h1 className="text-[#263238] mb-2">Volunteer Requests</h1>
        <p className="text-[#795548]">Review and approve volunteers requesting to join the NGO</p>
      </div>

      {/* Stats */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#795548] mb-1">Pending Requests</p>
            <p className="text-[#263238]">{requests.length}</p>
          </div>
          <div className="w-12 h-12 bg-[#FFF9C4] rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-[#F57F17]" />
          </div>
        </div>
      </Card>

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#F1F8E9] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#795548]" />
            </div>
            <h3 className="text-[#263238] mb-2">No pending requests</h3>
            <p className="text-[#795548]">All volunteer requests have been processed</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#F1F8E9] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-[#795548]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {/* NAME */}
                      <h3 className="text-[#263238] mb-1">
                        {request.volunteerName || "Volunteer"}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-[#795548]">
                        {/* LOCATION (If saved in Firestore) */}
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.volunteerAddress || "-"}</span>
                        </div>

                        {/* APPLY DATE → Use createdAt */}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Applied:{" "}
                            {request.createdAt?.toDate
                              ? request.createdAt.toDate().toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BIO */}
                  {request.volunteerBio && (
                    <p className="text-[#795548] mb-4">
                      {request.volunteerBio}
                    </p>
                  )}

                  <Separator className="my-4" />

                  {/* CONTACT DETAILS */}
                  <div className="space-y-2 mb-4">
                   <div className="flex items-center gap-2 text-sm text-[#795548]">
  <span className="w-16">Phone:</span>
  <span className="text-[#263238]">{request.volunteerPhone || "-"}</span>
</div>

<div className="flex items-center gap-2 text-sm text-[#795548]">
  <span className="w-16">Email:</span>
  <span className="text-[#263238]">{request.volunteerEmail || "-"}</span>
</div>

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(request.id)}
                      className="bg-[#689F38] hover:bg-[#558B2F]"
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </Button>

                    <Button
                      onClick={() => handleReject(request.id)}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  </Layout>
);
}