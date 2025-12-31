import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">FoodShare</span>
            </div>
            <p className="text-sm text-gray-300">
              Connecting donors and volunteers to rescue food and reduce waste.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">How It Works</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Donors</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-primary">Post Food</a></li>
              <li><a href="#" className="hover:text-primary">Track Donation</a></li>
              <li><a href="#" className="hover:text-primary">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Volunteers</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-primary">Find Donations</a></li>
              <li><a href="#" className="hover:text-primary">My Statistics</a></li>
              <li><a href="#" className="hover:text-primary">Support</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 FoodShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
