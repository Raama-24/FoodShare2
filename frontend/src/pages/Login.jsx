import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    const user = userCredential.user;

    // fetch role from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      setError("User data not found.");
      return;
    }

    const data = userSnap.data();

    // store locally
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userName", data.name);

    const userDoc = await getDoc(doc(db, "users", user.uid));
if (!userDoc.exists()) throw new Error("User not found");

const userData = userDoc.data();
if (!userData.verified) {
  alert("Your account is pending admin approval");
  return;
}


    // redirect
    navigate(`/dashboard/${data.role}`);
  } catch (err) {
    setError(err.message);
  }

  setLoading(false);
};


  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8E9]">
      <Header />

      <div className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#795548] mb-2">Welcome Back</h1>
              <p className="text-[#263238]/70">Sign in to your FoodShare account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#795548] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-[#263238]/40 bg-white text-[#263238] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] placeholder-[#263238]/50"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[#795548]">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[#8BC34A] hover:text-[#689F38] underline text-sm font-semibold"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-[#263238]/40 bg-white text-[#263238] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] placeholder-[#263238]/50"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-[#263238]"
                />
                <label htmlFor="rememberMe" className="text-sm text-[#263238]">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8BC34A] text-white rounded-lg font-bold hover:bg-[#689F38] disabled:opacity-50 transition mt-6 shadow-lg hover:shadow-[#689F38]/50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#263238]/40"></div>
              </div>
              <div className="relative flex justify-center text-sm text-[#263238]/70">
                <span className="px-2 bg-[#F1F8E9]">Or</span>
              </div>
            </div>

            <button className="w-full py-3 border border-[#263238]/40 rounded-lg font-medium text-[#263238] hover:bg-[#F1F8E9] transition">
              Continue with Google
            </button>

            <p className="mt-6 text-center text-[#263238]/70">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#8BC34A] font-semibold hover:text-[#689F38] underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

 
    </div>
  );
}

