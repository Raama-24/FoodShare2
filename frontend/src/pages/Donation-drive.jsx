import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Package,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import DriveDetailsModal from "./drivedetail";
import { useNavigate } from "react-router-dom";

export default function DonorDonationDrives() {
  const [searchQuery, setSearchQuery] = useState("");
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);

  const [showLockedModal, setShowLockedModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const drivesCol = collection(db, "donation_drives");
        const driveSnapshot = await getDocs(drivesCol);
        const driveList = driveSnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            ...data,
            date:
              data.date instanceof Object && data.date.seconds
                ? new Date(data.date.seconds * 1000)
                : data.date
                ? new Date(data.date)
                : null,
          };
        });

        setDrives(driveList);
      } catch (error) {
        console.error("Error fetching donation drives:", error);
      }
    };
    fetchDrives();
  }, []);

  useEffect(() => {
    const filtered = drives.filter(
      (drive) =>
        drive.ngoName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDrives(filtered);
  }, [searchQuery, drives]);

  function LockedModal({ onClose, onRegister }) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-80 text-center">
          <h2 className="text-xl font-semibold">Login Required</h2>
          <p className="text-gray-600 mt-2">
            Please register or login to view full details.
          </p>

          <Button
            onClick={onRegister}
            className="w-full bg-[#689F38] text-white mt-4 h-11 rounded-lg"
          >
            Register
          </Button>

          <button
            onClick={onClose}
            className="mt-3 text-gray-500 underline text-sm"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F8E9]">
      {/* Header */}
      <motion.div
        className="bg-[#689F38] text-white py-8 px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-yellow-300" size={24} />
            <h1 className="text-white mb-0">Donation Drives</h1>
          </div>
          <p className="text-white/90 mt-1">
            Make a difference in your community today
          </p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#795548]/50"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search by NGO name, area, or drive type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white border border-[#8BC34A] h-14 rounded-xl focus:border-[#689F38]"
            />
          </div>
        </div>

        {/* Drives List */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-5">
            {filteredDrives.map((drive, index) => (
              <motion.div
                key={drive.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="  bg-white rounded-xl border border-[#8BC34A]/40 overflow-hidden  transition-all duration-300 
                  hover:border-[#795548]
                   hover:shadow-lg" >
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-[#8BC34A]">
                      <Package className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-[#263238] mb-1">{drive.ngoName}</h3>
                      <div className="inline-block px-3 py-1 rounded-full text-white text-xs bg-[#689F38]">
                        {drive.title}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-[#795548] bg-[#F1F8E9] rounded-lg p-2">
                      <MapPin size={16} className="mr-3 text-[#689F38]" />
                      <span className="text-sm">{drive.location}</span>
                    </div>
                    <div className="flex items-center text-[#795548] bg-[#F1F8E9] rounded-lg p-2">
                      <Calendar size={16} className="mr-3 text-[#689F38]" />
                      <span className="text-sm">
                        {drive.date
                          ? drive.date.toLocaleDateString()
                          : "No date available"}
                      </span>
                    </div>
                    <div className="flex items-center text-[#795548] bg-[#F1F8E9] rounded-lg p-2">
                      <Clock size={16} className="mr-3 text-[#795548]" />
                      <span className="text-sm">{drive.time}</span>
                    </div>
                  </div>

                  {/* VIEW DETAILS BUTTON */}
                  <Button
                    /* In DonorDonationDrives — inside the View Details onClick */
                    onClick={() => {
                      if (auth.currentUser) {
                        setSelectedDrive({ ...drive }); // ensure copy
                        setShowLockedModal(false);
                      } else {
                        setShowLockedModal(true);
                        setSelectedDrive(null);
                      }
                    }}
                    className="w-full bg-[#689F38] hover:bg-[#8BC34A] text-white h-12 rounded-xl"
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Full Details Modal */}
        {selectedDrive && !showLockedModal && (
          <DriveDetailsModal
            drive={selectedDrive}
            onClose={() => setSelectedDrive(null)}
            open={true}
          />
        )}

        {/* Locked Modal */}
        {showLockedModal && (
          <LockedModal
            onClose={() => setShowLockedModal(false)}
            onRegister={() => navigate("/signup")}
          />
        )}

        {filteredDrives.length === 0 && (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto mb-4 text-[#795548]/30" />
            <p className="text-[#795548]/70">No donation drives found</p>
          </div>
        )}
      </div>
    </div>
  );
}
