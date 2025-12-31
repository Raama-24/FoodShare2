import { useState, useEffect } from "react";
import {
  MapPin, Package,
  Calendar,
  Clock,
  Plus,
  Heart,
  Badge,
  Users,
  TrendingUp,
  Gift,
  Phone,
  Package as PackageIcon,
  CircleDollarSign, UserCheck, DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import Layout from "./ngoLayout";
// import CreateDriveModal from './CreateDriveModal';

function DonorsSection({ driveId }) {
  const [donors, setDonors] = useState([]);

  useEffect(() => {  
    if (!driveId) {
      console.error("❌ ERROR: driveId is missing! Cannot fetch donors.");
      return;
    }

    const fetchDonors = async () => {
      try {

        const donationsRef = collection(
          db,
          "donation_drives",
          driveId, // <-- ensured valid before using
          "donation_confirmations"
        );     

         const donorQuery = query(donationsRef, where("type", "==", "donor"));
        const snapshot = await getDocs(donorQuery);
        const donorsList = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        setDonors(donorsList);

        console.log("✔ Donors Loaded =", donorsList.length);
      } catch (error) {
        console.error("❌ Full Error =", error);
      }
    };

    fetchDonors();
  }, [driveId]);

  // DERIVED VALUES
  const totalMoney = donors.reduce((sum, d) => sum + (d.amount || 0), 0);
  const itemDonors = donors.filter((d) => d.items).length;
  const moneyDonors = donors.filter((d) => d.amount).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#689F38] to-[#8BC34A]" />

        <CardHeader className="bg-gradient-to-br from-white to-[#F1F8E9]/30">
          <CardTitle className="text-[#263238] flex items-center">
            <div className="p-2 bg-gradient-to-br from-[#689F38] to-[#558B2F] rounded-xl mr-3">
              <Heart className="text-white" size={24} fill="white" />
            </div>
            Donors List
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {/* LIST */}
          <div className="space-y-4 mb-8">
            {donors.map((donor, index) => (
              <motion.div
                key={donor.id}
                className="relative overflow-hidden bg-white border-2 border-[#689F38]/20 rounded-2xl hover:shadow-xl transition-all group"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.01, y: -2 }}>               

                <div className="absolute inset-0 bg-gradient-to-r from-[#F1F8E9]/0 via-[#F1F8E9]/50 to-[#F1F8E9]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between p-5 relative z-10">
                  <div className="flex-1 pr-4">
                    {/* ICON + NAME */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2 rounded-xl ${
                          donor.amount
                            ? "bg-gradient-to-br from-[#689F38] to-[#558B2F]"
                            : "bg-gradient-to-br from-[#8BC34A] to-[#689F38]"
                        }`}
                      >
                       
                          <div className="text-white" size={20} />
                     
                      </div>

                      <div>
                        <h4 className="text-[#263238] group-hover:text-[#689F38] transition-colors">
                          {donor.donorName}
                        </h4>

                        {donor.donorPhone && donor.donorPhone !== "-" && (
                          <div className="flex items-center text-sm text-[#795548] mt-1">
                            <Phone
                              size={12}
                              className="mr-1.5 text-[#8BC34A]"
                            />
                            {donor.donorPhone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ITEMS */}
                    {donor.donationDetails && (
                      <motion.div
                        className="flex items-start mt-3 bg-[#F1F8E9] rounded-xl p-3"
                        whileHover={{ x: 4 }}
                      >
                        <Package size={16} className="mr-3 text-[#8BC34A]" />
                        <p className="text-sm text-[#263238]">{donor.donationDetails}</p>
                      </motion.div>
                    )}

                    {/* MONEY */}
                    {donor.amount && (
                      <motion.div
                        className="flex items-center mt-3 bg-gradient-to-r from-[#689F38]/10 to-[#8BC34A]/10 rounded-xl p-3"
                        whileHover={{ x: 4 }}
                      >
                        <DollarSign size={18} className="mr-2 text-[#689F38]" />
                        <span className="text-lg text-[#689F38]">
                          ₹{donor.amount.toLocaleString()}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                    <Badge
                      className={`${
                        donor.amount
                          ? "bg-gradient-to-r from-[#689F38] to-[#558B2F]"
                          : "bg-gradient-to-r from-[#8BC34A] to-[#689F38]"
                      } text-white border-none shadow-lg px-4 py-2`}
                    >
                      {donor.amount ? "Money" : "Items"}
                    </Badge>
                  </motion.div>
                </div>

                <div
                  className={`h-1 bg-gradient-to-r ${
                    donor.amount
                      ? "from-[#689F38] to-[#558B2F]"
                      : "from-[#8BC34A] to-[#689F38]"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* ANALYTICS */}
          <motion.div
            className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-[#F1F8E9] to-[#E8F5E9] rounded-2xl border-2 border-[#689F38]/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: donors.length * 0.1 + 0.3 }}
          >
            <motion.div className="text-center bg-white rounded-xl p-4 shadow-md">
              <motion.p className="text-3xl text-[#263238] mb-1">
                {donors.length}
              </motion.p>
              <p className="text-xs text-[#795548]/70">Total Donors</p>
            </motion.div>

            <motion.div className="text-center bg-gradient-to-br from-[#8BC34A] to-[#689F38] rounded-xl p-4 shadow-md">
              <motion.p className="text-3xl text-white mb-1">
                {itemDonors}
              </motion.p>
              <p className="text-xs text-white/90">Item Donations</p>
            </motion.div>

            <motion.div className="text-center bg-gradient-to-br from-[#689F38] to-[#558B2F] rounded-xl p-4 shadow-md">
              <motion.p className="text-2xl text-white mb-1">
                ₹{totalMoney.toLocaleString()}
              </motion.p>
              <p className="text-xs text-white/90">Money Raised</p>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



function VolunteersSection({ driveId }) {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {   
    if (!driveId) return console.error("❌ Missing driveId!");

    const fetchVolunteers = async () => {
      try {
        const volunteersRef = collection(
          db,
          "donation_drives",
          driveId,
          "donation_confirmations"
        );
         const volunteerQuery = query(volunteersRef, where("type", "==", "volunteer"));
        const snapshot = await getDocs(volunteerQuery);
        const volunteerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVolunteers(volunteerList);     
      } catch (error) {
        console.error("❌ Error fetching volunteers:", error);
      }
    };

    fetchVolunteers();
  }, [driveId]);

  const totalHours = volunteers.reduce(
    (sum, v) => sum + (v.volunteerHours || 0),
    0
  );
return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <Card className="border-none shadow-2xl overflow-hidden">
      {/* ✔ Top Accent Strip */}
      <div className="h-2 bg-gradient-to-r from-[#689F38] to-[#8BC34A]" />

      <CardHeader className="bg-gradient-to-br from-white to-[#F1F8E9]/60">
        <CardTitle className="text-[#263238] flex items-center">
          <div className="p-2 bg-gradient-to-br from-[#689F38] to-[#8BC34A] rounded-xl mr-3">
            <UserCheck className="text-white" size={24} />
          </div>
          Volunteers
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {/* LIST */}
        <div className="space-y-4 mb-8">
          {volunteers.map((vol, index) => (
            <motion.div
              key={vol.id}
              className="relative bg-white border-2 border-[#8BC34A]/30 rounded-2xl p-5 hover:shadow-xl transition-all"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg text-[#263238] font-semibold">
                    {vol.volunteerName}
                  </h3>

                  {vol.volunteerPhone && (
                    <div className="flex items-center text-sm text-[#455A64] mt-1">
                      <Phone size={12} className="mr-1 text-[#8BC34A]" />
                      {vol.volunteerPhone}
                    </div>
                  )}

                  {vol.volunteerRole && (
                    <p className="text-sm mt-2 text-[#689F38]">
                      Role: {vol.volunteerRole}
                    </p>
                  )}

                  {vol.volunteerHours > 0 && (
                    <motion.div
                      className="flex items-center mt-3 bg-[#F1F8E9] rounded-xl p-3"
                      whileHover={{ x: 4 }}
                    >
                      <Clock size={16} className="mr-2 text-[#8BC34A]" />
                      <span className="text-base text-[#689F38]">
                        {vol.volunteerHours} hrs
                      </span>
                    </motion.div>
                  )}
                </div>

                <Badge className="bg-gradient-to-r from-[#689F38] to-[#8BC34A] text-white shadow-md">
                  Volunteer
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ANALYTICS */}
        <motion.div
          className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-[#F1F8E9] to-[#8BC34A]/30 rounded-2xl
          border-2 border-[#689F38]/30 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: volunteers.length * 0.1 + 0.3 }}
        >
          <div className="text-center bg-white rounded-xl p-4 shadow-md">
            <p className="text-3xl text-[#263238] mb-1">{volunteers.length}</p>
            <p className="text-xs text-[#455A64]/70">Total Volunteers</p>
          </div>

          <div className="text-center bg-gradient-to-br from-[#8BC34A] to-[#689F38] rounded-xl p-4 shadow-md">
            <p className="text-2xl text-white mb-1">{totalHours}</p>
            <p className="text-xs text-white/90">Total Hours</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);
}
export default function NGOdriveDashboard() {
  const [drives, setDrives] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDriveId, setActiveDriveId] = useState(null);
  const [activeTab, setActiveTab] = useState("volunteers");

  // Fetch drives for this NGO
  useEffect(() => {
    const fetchDrives = async () => {
      if (!auth.currentUser) {        
        return;
      }
     
      const q = query(
        collection(db, "donation_drives"),
        where("createdBy", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));    

      setDrives(list);
    };

    fetchDrives();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[#F1F8E9]">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-[#689F38] to-[#8BC34A] text-white py-8 px-4 shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Manage Donation Drive</h1>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-[#689F38] hover:bg-white/90 rounded-xl px-4 py-2 flex items-center gap-2"
            >
              <Plus size={18} />
              Create Drive
            </Button>
          </div>
        </motion.div>

        {/* Drives */}
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {drives.map((drive) => (
            <motion.div
              key={drive.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-lg border-none overflow-hidden mb-4">
                <CardHeader className="bg-white pb-4">
                  <CardTitle className="text-[#263238] text-lg">
                    {drive.title}
                  </CardTitle>
                  {drive.description && (
                    <p className="text-[#795548]/80 mt-1 text-sm">
                      {drive.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#8BC34A]" />
                    <span>{drive.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[#689F38]" />
                    <span>{new Date(drive.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#795548]" />
                    <span>{drive.time}</span>
                  </div>
                </CardContent>

                <CardContent>
                  <Button
                    onClick={() => {                      
                      setActiveDriveId(
                        activeDriveId === drive.id ? null : drive.id
                      );
                    }}
                    className="bg-[#689F38] hover:bg-[#8BC34A] text-white rounded-xl mt-3"
                  >
                    {activeDriveId === drive.id
                      ? "Hide Details"
                      : "View Details"}
                  </Button>
                </CardContent>
              </Card>

              {/* Expanded tabs */}
              <AnimatePresence>
                {activeDriveId === drive.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-2"
                  >
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="space-y-6"
                    >
                      <TabsList className="grid w-full grid-cols-3 bg-white shadow-xl p-2 rounded-2xl">
                        {[
                          {
                            value: "volunteers",
                            icon: Users,
                            label: "Volunteers",
                          },
                          { value: "donors", icon: Heart, label: "Donors" },
                          {
                            value: "analytics",
                            icon: TrendingUp,
                            label: "Analytics",
                          },
                        ].map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8BC34A] data-[state=active]:to-[#689F38] data-[state=active]:text-white"
                          >
                            <tab.icon size={18} className="mr-2" />
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <TabsContent value="donors">
                        <DonorsSection driveId={drive.id} />
                      </TabsContent>

                      <TabsContent value="volunteers">
                        <VolunteersSection driveId={drive.id} />
                      </TabsContent>
                      
                    </Tabs>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
