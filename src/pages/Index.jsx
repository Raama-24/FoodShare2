import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  Heart,
  MapPin,
  ArrowRight,
  Users,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8E9]">

      {/* HEADER */}
      <Header />

      {/* -------------------- HERO -------------------- */}
      <section className="flex-1">
        <div
          className="w-full h-[550px] bg-top bg-no-repeat bg-cover flex flex-col items-center justify-center text-center"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        >
          <div className="max-w-3xl mx-auto px-4">

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Connect Donors and Volunteers
              <span className="text-[#8BC34A]"> Instantly</span>
            </h1>

            <div className="inline-block px-4 py-2 bg-[#689F38] rounded-full mb-6">
              <span className="text-sm font-semibold text-white">
                Share your Food, Share your Love.
              </span>
            </div>

            {/* BUTTON inside BG */}
            <div className="flex justify-center">
              <Link
                to="/signup"
                className="mt-10 px-8 py-3 bg-[#8BC34A] text-white rounded-lg font-semibold hover:bg-[#689F38] transition"
              >
                Get Started
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------- HOW IT WORKS -------------------- */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-[#795548] mb-4">
            How FoodShare Works
          </h2>
          <p className="text-lg text-[#263238] mb-16">
            Three simple steps to make a difference
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Step 1 */}
            <div>
              <div className="w-12 h-12 rounded-full bg-[#8BC34A] text-white flex items-center justify-center font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#795548] mb-3">Donor Posts Food</h3>
              <p className="text-[#263238]">Post surplus food with details like type, quantity, and location.</p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="w-12 h-12 rounded-full bg-[#8BC34A] text-white flex items-center justify-center font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#795548] mb-3">Volunteer Accepts</h3>
              <p className="text-[#263238]">Volunteers view nearby donations on a live map and accept pickups.</p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="w-12 h-12 rounded-full bg-[#8BC34A] text-white flex items-center justify-center font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#795548] mb-3">Food Delivered</h3>
              <p className="text-[#263238]">Volunteers deliver food to homes, NGOs, or community shelters.</p>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------- MODULES -------------------- */}
      <section className="py-20 md:py-32 bg-[#F1F8E9]">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-[#795548] mb-4">
            Three Powerful Modules
          </h2>
          <p className="text-lg text-[#263238] mb-16">
            Each role has features built for their needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* DONOR MODULE */}
            <div className="bg-white rounded-xl p-8 border hover:border-[#8BC34A] hover:shadow-md transition">
              <div className="w-14 h-14 rounded-lg bg-[#8BC34A30] flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-[#8BC34A]" />
              </div>

              <h3 className="text-2xl font-bold text-[#795548] mb-4">For Donors</h3>
              <p className="text-[#263238] mb-6">Post surplus food and connect with volunteers instantly.</p>

              <ul className="space-y-3 text-left mb-8">
                {[
                  "Easy food posting",
                  "Live volunteer tracking",
                  "Real-time notifications",
                  "Edit or cancel posts",
                  "Donation history",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8BC34A] mt-1" />
                    <span className="text-[#263238] text-sm">{t}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup?role=donor"
                className="block w-full px-4 py-2 bg-[#8BC34A] text-white rounded-lg font-semibold hover:bg-[#689F38] transition"
              >
                Start Donating
              </Link>
            </div>

            {/* VOLUNTEER MODULE */}
            <div className="bg-white rounded-xl p-8 border-2 border-[#8BC34A] shadow-md">
              <div className="w-14 h-14 rounded-lg bg-[#689F3830] flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#689F38]" />
              </div>

              <h3 className="text-2xl font-bold text-[#795548] mb-4">For Volunteers</h3>
              <p className="text-[#263238] mb-6">Accept pickups, track routes, and build a profile.</p>

              <ul className="space-y-3 text-left mb-8">
                {[
                  "Nearby donations",
                  "One-tap acceptance",
                  "Route optimization",
                  "Performance dashboard",
                  "Verification badge",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8BC34A] mt-1" />
                    <span className="text-[#263238] text-sm">{t}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup?role=volunteer"
                className="block w-full px-4 py-2 bg-[#689F38] text-white rounded-lg font-semibold hover:bg-[#8BC34A] transition"
              >
                Join as Volunteer
              </Link>
            </div>

            {/* ADMIN MODULE */}
            <div className="bg-white rounded-xl p-8 border hover:border-[#8BC34A] hover:shadow-md transition">
              <div className="w-14 h-14 rounded-lg bg-[#79554820] flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-[#795548]" />
              </div>

              <h3 className="text-2xl font-bold text-[#795548] mb-4">For Admins</h3>
              <p className="text-[#263238] mb-6">Monitor platform activity and manage all users.</p>

              <ul className="space-y-3 text-left mb-8">
                {[
                  "Approve volunteers",
                  "Remove accounts",
                  "Impact analytics",
                  "Export data",
                  "Performance tracking",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8BC34A] mt-1" />
                    <span className="text-[#263238] text-sm">{t}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
              >
                Admin Access Only
              </button>
            </div>

          </div>
        </div>
      </section>
<hr />
      {/* -------------------- WHY CHOOSE US -------------------- */}
<section className="py-15 md:py-32 bg-[#F1F8E9]">
  <div className="max-w-6xl mx-auto px-4 text-center">

    <h2 className="text-3xl md:text-4xl font-bold text-[#795548] mb-12">
      Why Choose FoodShare?
    </h2>

    <p className="text-lg text-[#263238]/80 mb-12 max-w-3xl mx-auto">
      FoodShare connects donors and volunteers to reduce food waste and fight hunger in our communities. 
      Our platform makes it simple to share surplus food, track donations in real-time, and ensure it reaches 
      the people who need it most. Whether you are a donor, volunteer, or organization, FoodShare provides 
      a seamless and transparent way to make a meaningful impact.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          icon: <Zap className="w-6 h-6 text-[#689F38]" />,
          title: "Instant Connection",
          text: "Get connected with volunteers or donors instantly. Post food or accept pickups within minutes.",
        },
        {
          icon: <MapPin className="w-6 h-6 text-[#689F38]" />,
          title: "Live Tracking",
          text: "Track every donation in real-time with GPS-enabled mapping. Know exactly where your contribution goes.",
        },
        {
          icon: <TrendingUp className="w-6 h-6 text-[#689F38]" />,
          title: "Measure Impact",
          text: "Monitor your contributions and see the collective impact on reducing food waste in your community.",
        },
        {
          icon: <Shield className="w-6 h-6 text-[#689F38]" />,
          title: "Verified Users",
          text: "All donors, volunteers, and partner organizations are verified for safety, ensuring trustworthy interactions.",
        },
      ].map((f, i) => (
        <div key={i} className="flex flex-col items-center text-center p-6">
          <div className="w-12 h-12 rounded-lg bg-[#8BC34A30] flex items-center justify-center mb-4">
            {f.icon}
          </div>
          <h4 className="font-semibold text-[#795548] mb-2">{f.title}</h4>
          <p className="text-sm text-[#263238]/80">{f.text}</p>
        </div>
      ))}
    </div>

   

  </div>
</section>
<hr></hr>

   {/* -------------------- OUR MISSION -------------------- */}
<section className="py-10 md:py-20 bg-[#F1F8E9]">
  <div className="max-w-6xl mx-auto px-4 text-center">
    
    <h2 className="text-3xl md:text-4xl font-bold text-[#795548] mb-6">
      Our Mission
    </h2>

    <p className="text-lg md:text-xl text-[#263238]/90 max-w-3xl mx-auto leading-relaxed">
      At FoodShare, our mission is to bridge the gap between surplus food and those in need. 
      We empower donors to contribute effortlessly, volunteers to act efficiently, 
      and communities to thrive sustainably. By connecting people with purpose, 
      we aim to reduce food waste, support local NGOs, and make a tangible difference 
      in the lives of countless individuals.
    </p>

    <div className="mt-8">
      <span className="inline-block w-24 h-1 bg-[#8BC34A] rounded-full"></span>
    </div>

  </div>
</section>


    
    </div>
  );
}
