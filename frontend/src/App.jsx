import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Index from "./pages/Index";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";

import DonorDashboard from "./pages/Dashboard";
import Volunteer from "./pages/Volunteer";

import NgoDashboard from "./pages/ngo";
import PostDonation from "./pages/PostDonation";
 import  Request  from "./pages/ngorequest"; 
 import NGODonationDrive from "./pages/ngod-d";

import AdminSignup from "./pages/AdminSignup";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import  Members  from "./pages/ngomembers";

import DonorDonationDrives from "./pages/Donation-drive";
import NGOdriveDashboard from "./pages/ngod-d";
export default function App() {
  return (
    <Router>
  

      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* ROLE-WISE DASHBOARDS */}
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
          <Route path="/dashboard/volunteer" element={<Volunteer />} />
          <Route path="/dashboard/ngo" element={<NgoDashboard />} />
          <Route path="/dashboard/ngo/requests" element={<Request />} />
          <Route path="/dashboard/ngo/members" element={<Members />} />
          <Route path="/dashboard/ngo/donation-drive" element={<NGOdriveDashboard />} />
         
          
          {/* OTHER ROUTES */}
          <Route path="/post-donation" element={<PostDonation />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/donation-drive" element={<DonorDonationDrives />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}
