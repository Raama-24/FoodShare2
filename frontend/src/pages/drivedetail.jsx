import {  X,  Lock, MapPin,  Calendar, Clock,  Phone,  Heart,  Users,} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp ,getDoc,doc} from "firebase/firestore";
import toast from "react-hot-toast";

export default function DriveDetailsModal({ drive, onClose }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [donationText, setDonationText] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  /* In DriveDetailsModal — top of component, for debugging */
  useEffect(() => {}, [drive]);

const confirmVolunteer = async (driveId, ngoId) => {
    try {
      const user = auth.currentUser;
      if (!user) return toast.error("Login to continue");

      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) return toast.error("User profile not found");
      const userData = userSnap.data();

      await addDoc(
        collection(db, "donation_drives", driveId, "donation_confirmations"),
        {
          userId: user.uid,
          type: "volunteer",
          volunteerName: userData.name,
          volunteerPhone: userData.phone,
          ngoId: ngoId,
          donationDetails: donationText || "Not specified",
          createdAt: serverTimestamp(),
        }
      );


      toast.success("Volunteer confirmation submitted");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const confirmDonor = async (driveId, ngoId) => {
    try {
      const user = auth.currentUser;
      if (!user) return toast.error("Login to continue");

      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) return toast.error("User profile not found");

      const userData = userSnap.data();

      await addDoc(
        collection(db, "donation_drives", driveId, "donation_confirmations"),
        {
          userId: user.uid,
          type: "donor",
          donorName: userData.name,
          donorPhone: userData.phone,
          ngoId: ngoId,
          donationDetails: donationText || "Not specified",
          createdAt: serverTimestamp(),
        }
      );

      toast.success("Donation confirmation submitted");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  if (!drive) return null;

  const formattedDate = drive.date
    ? drive.date.seconds
      ? new Date(drive.date.seconds * 1000).toLocaleDateString()
      : new Date(drive.date).toLocaleDateString()
    : "N/A";

  return (
    <Dialog open={!!drive} onOpenChange={onClose}>
      <DialogContent className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-xl p-6">
        {/* Header */}
        <DialogHeader className="relative mb-4">
          <DialogTitle className="text-[#263238] text-xl font-semibold pr-8">
            {drive.ngoName || "NGO Name"}
          </DialogTitle>
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute right-0 top-0 p-2 hover:bg-[#F1F8E9] rounded-full"
          >
            <X size={20} className="text-[#795548]" />
          </Button>
        </DialogHeader>

        {/* Locked Overlay */}
        {!authLoading && !isLoggedIn && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm p-6 rounded-xl">
            <Lock size={40} className="text-[#689F38] mb-4" />
            <p className="text-[#795548] text-center mb-4 px-4">
              You need an account to view full details of this donation drive.
            </p>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-[#689F38] hover:bg-[#558B2F] text-white px-6 py-3 rounded-xl"
            >
              Register to Unlock
            </Button>
          </div>
        )}
        {/* Content */}
        <div
          className={`${
            !authLoading && !isLoggedIn ? "blur-sm pointer-events-none" : ""
          } space-y-6`}
        >
          {/* Bio / Description at top */}
          {drive.description && (
            <div className="bg-[#F1F8E9] p-4 rounded-xl text-[#263238]">
              {drive.description}
            </div>
          )}

          {/* Full-width Info Boxes */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow border border-[#8BC34A]/30 flex flex-col w-full">
              <span className="text-sm text-[#795548]/80 mb-1 font-medium">
                DATE
              </span>
              <span className="text-[#263238]">{formattedDate}</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow border border-[#8BC34A]/30 flex flex-col w-full">
              <span className="text-sm text-[#795548]/80 mb-1 font-medium">
                TIME
              </span>
              <span className="text-[#263238]">{drive.time || "N/A"}</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow border border-[#8BC34A]/30 flex flex-col w-full">
              <span className="text-sm text-[#795548]/80 mb-1 font-medium">
                FULL ADDRESS
              </span>
              <span className="text-[#263238]">{drive.location || "N/A"}</span>
            </div>
          </div>

          {/* Donation Input */}
          <div className="bg-white p-4 rounded-xl shadow border border-[#8BC34A]/30 flex flex-col">
            <label className="text-sm text-[#795548]/80 mb-1 font-medium">
              What will you donate? (Optional)
            </label>
            <textarea
              value={donationText}
              onChange={(e) => setDonationText(e.target.value)}
              placeholder="e.g., 5kg rice, clothes, books..."
              className="border border-[#8BC34A]/50 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#689F38]"
              rows={3}
            />
          </div>

          {/* Requirements */}
          {drive.requirements?.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow border border-[#8BC34A]/30">
              <p className="text-sm text-[#795548]/70 mb-3 font-medium">
                Requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {drive.requirements.map((req, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-[#F1F8E9] border border-[#8BC34A]/30 rounded-full text-sm text-[#689F38]"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-white p-4 rounded-xl shadow border border-[#8BC34A]/30 flex flex-col gap-2">
            <span className="text-sm text-[#795548]/80 font-medium">
              Contact Number
            </span>

            <span className="text-[#689F38]">{drive.ngoPhone || "N/A"}</span>
          </div>

          {/* CTA Buttons */}
          {/* FIXED CTA BUTTONS */}
          <div
            className="sticky bottom-0 left-0 w-full bg-white pt-4 pb-2 mt-6 
                flex flex-col md:flex-row gap-3 border-t border-[#E0E0E0]"
          >
            <Button
              onClick={() => confirmVolunteer(drive.id, drive.createdBy)}
              className="bg-[#689F38] hover:bg-[#558B2F] text-white rounded-xl h-12 
               flex-1 flex items-center justify-center gap-2"
            >
              <Users size={18} />
              Confirm Volunteer
            </Button>

            <Button
              onClick={() => confirmDonor(drive.id, drive.createdBy)}
              className="bg-[#689F38] hover:bg-[#558B2F] text-white rounded-xl h-12 
               flex-1 flex items-center justify-center gap-2"
            >
              <Heart size={18} /> Confirm Donate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
