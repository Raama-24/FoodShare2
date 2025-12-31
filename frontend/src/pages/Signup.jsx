import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Heart, Users, Shield, ArrowLeft } from "lucide-react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp ,getDoc } from "firebase/firestore";


export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(initialRole ? "form" : "role");
  const [selectedRole, setSelectedRole] = useState(initialRole || null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    organizationName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "donor",
      title: "Food Donor",
      description: "Post surplus food and help reduce waste",
      icon: Heart,
      color: "bg-[#F1F8E9]",
      textColor: "text-[#689F38]",
    },
    {
      id: "volunteer",
      title: "Volunteer",
      description: "Pick up and deliver food to communities",
      icon: Users,
      color: "bg-[#F1F8E9]",
      textColor: "text-[#689F38]",
    },
    {
      id: "ngo",
      title: "NGO Organization",
      description: "Manage volunteer network and distributions",
      icon: Shield,
      color: "bg-[#F1F8E9]",
      textColor: "text-[#795548]",
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep("form");
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: selectedRole,
        address: formData.address,
        verified: false, 
      createdAt: new Date(),
    });

    // store locally
    localStorage.setItem("userRole", selectedRole);
    localStorage.setItem("userName", formData.name);

    // redirect
    navigate(`/dashboard/${selectedRole}`);
  } catch (err) {
    setError(err.message);
  }

  setLoading(false);
};


  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8E9]">
      <Header />

      <div className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {step === "role" ? (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-[#263238] mb-4">
                  Join FoodShare
                </h1>
                <p className="text-lg text-[#263238]/70">
                  Choose your role to get started
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className="p-8 border-2 border-[#795548] bg-white rounded-2xl hover:border-[#8BC34A] hover:bg-[#F1F8E9] transition-all text-left group"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent
                          className={`w-7 h-7 ${role.textColor}`}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-[#795548] mb-2">
                        {role.title}
                      </h3>
                      <p className="text-sm text-[#263238]/80 mb-4">
                        {role.description}
                      </p>
                      <div className="text-[#8BC34A] font-semibold flex items-center gap-2">
                        Get Started →
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 text-center">
                <p className="text-[#263238]/80">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-[#8BC34A] font-semibold hover:text-[#689F38]"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setStep("role")}
                className="flex items-center gap-2 text-[#8BC34A] font-semibold mb-8 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to role selection
              </button>

              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-[#263238] mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-[#263238]/70">
                    As a{" "}
                    <span className="font-semibold text-[#8BC34A]">
                      {roles.find((r) => r.id === selectedRole)?.title}
                    </span>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    "name",
                    "email",
                    "phone",
                    "organizationName",
                    "city",
                    "address",
                    "password",
                    "confirmPassword",
                  ].map((field) => {
                    if (field === "organizationName" && selectedRole !== "ngo")
                      return null;
                    const placeholderMap = {
                      name: "John Doe",
                      email: "john@example.com",
                      phone: "+1 (555) 123-4567",
                      organizationName: "Your Organization",
                      city: "New York",
                      address: "123 Main Street",
                      password: "••••••••",
                      confirmPassword: "••••••••",
                    };
                    const labelMap = {
                      name: "Full Name *",
                      email: "Email *",
                      phone: "Phone Number",
                      organizationName: "Organization Name",
                      city: "City",
                      address: "Address",
                      password: "Password *",
                      confirmPassword: "Confirm Password *",
                    };
                    return (
                      <div key={field}>
                        <label className="block text-sm font-semibold text-[#795548] mb-2">
                          {labelMap[field]}
                        </label>
                        <input
                          type={
                            field.includes("password")
                              ? "password"
                              : field === "email"
                              ? "email"
                              : "text"
                          }
                          name={field}
                          value={formData[field]}
                          onChange={handleInputChange}
                          placeholder={placeholderMap[field]}
                          className="w-full px-4 py-3 border border-[#263238]/40 bg-white text-[#263238] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] placeholder-[#263238]/50"
                          required={
                            field === "name" ||
                            field === "email" ||
                            field.includes("password")
                          }
                        />
                      </div>
                    );
                  })}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#8BC34A] text-white rounded-lg font-bold hover:bg-[#689F38] disabled:opacity-50 transition mt-6 shadow-lg hover:shadow-[#689F38]/50"
                  >
                    Create Account
                  </button>

                  {/* Success message */}
                  {success && (
                    <div className="mt-4 p-3 bg-[#8BC34A]/20 border border-[#8BC34A] text-[#689F38] rounded-lg text-center">
                      {success}
                    </div>
                  )}
                </form>

                <p className="mt-6 text-center text-[#263238]/70">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-[#8BC34A] font-semibold hover:text-[#689F38]"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

