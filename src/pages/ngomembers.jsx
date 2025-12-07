import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { User, Phone, Mail, MapPin } from "lucide-react";

import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Layout from "./ngoLayout";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const ngoId = auth.currentUser?.uid; // CURRENT LOGGED-IN NGO ID

  const statusColors = {
    available: "bg-[#C8E6C9] text-[#2E7D32] border-[#A5D6A7]",
    "on-duty": "bg-[#BBDEFB] text-[#1565C0] border-[#90CAF9]",
    offline: "bg-[#F1F8E9] text-[#795548] border-[rgba(121,85,72,0.3)]",
  };

  useEffect(() => {
    if (!ngoId) return;

    const q = query(
      collection(db, "ngo_join_requests"),
      where("ngoId", "==", ngoId),
      where("status", "==", "approved")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMembers(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: "available", // default (since not in DB)
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, [ngoId]);

  return (
    <Layout>
    <div>
      <div className="mb-8">
        <h1 className="text-[#263238] mb-2">Members</h1>
        <p className="text-[#795548]">
          Approved NGO volunteers available for pickup assignments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#795548] mb-1">Total Members</p>
              <p className="text-[#263238]">
                {loading ? "…" : members.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#F1F8E9] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-[#795548]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#795548] mb-1">Available</p>
              <p className="text-[#263238]">
                {members.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#C8E6C9] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-[#2E7D32]" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#795548] mb-1">On Duty</p>
              <p className="text-[#263238]">0</p>
            </div>
            <div className="w-12 h-12 bg-[#BBDEFB] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-[#1565C0]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <div className="p-6 border-b border-[rgba(121,85,72,0.15)]">
          <h2 className="text-[#263238]">All Members</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <span className="text-[#795548]">Loading...</span>
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <span className="text-[#795548]">No Approved Members</span>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F1F8E9] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#795548]" />
                      </div>
                      <span className="text-[#263238]">
                        {member.volunteerName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-[#795548]">
                      <Phone className="w-4 h-4" />
                      <span>{member.volunteerPhone}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-[#795548]">
                      <Mail className="w-4 h-4" />
                      <span>{member.volunteerEmail}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-[#795548]">
                      <MapPin className="w-4 h-4" />
                      <span>{member.volunteerAddress}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={statusColors["available"]}
                      variant="outline"
                    >
                      available
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
    </Layout>
  );
}
