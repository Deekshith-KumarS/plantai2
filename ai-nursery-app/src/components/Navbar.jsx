import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Menu, X, ShoppingCart, LogOut, Bell } from "lucide-react";
import { API_URL } from "../config";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rescueNotifications, setRescueNotifications] = useState(0);

  useEffect(() => {
    if (user && localStorage.getItem("token")) {
      fetch(`${API_URL}/api/requests/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.incoming) {
          const pending = data.incoming.filter(req => req.status === "Pending").length;
          setRescueNotifications(pending);
        }
      })
      .catch(console.error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navStyle = ({ isActive }) =>
    `px-4 py-2 rounded-xl transition font-semibold whitespace-nowrap ${
      isActive
        ? "bg-green-700 text-white shadow-md"
        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
    }`;

  const mobileNavStyle = ({ isActive }) =>
    `block px-5 py-4 rounded-2xl transition font-bold text-lg ${
      isActive
        ? "bg-green-700 text-white shadow-lg"
        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500">
              PlantAI
            </span>
            <span className="text-3xl">🌿</span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-2">
            <NavLink to="/dashboard" className={navStyle}>Dashboard</NavLink>
            <NavLink to="/shop" className={navStyle}>Explore</NavLink>
            <NavLink to="/wishlist" className={navStyle}>Wishlist</NavLink>
            <NavLink to="/rescue-map" className={navStyle}>Rescue Map</NavLink>
            <NavLink to="/rescue/leaderboard" className={navStyle}>Leaderboard</NavLink>
            <NavLink to="/disease-detection" className={navStyle}>AI Detection</NavLink>
            <NavLink to="/monitor" className={navStyle}>Smart Monitor</NavLink>
            
            <NavLink to="/rescue/dashboard" className={({ isActive }) =>
              `relative px-4 py-2 rounded-xl transition font-semibold whitespace-nowrap flex items-center gap-1 ${
                isActive
                  ? "bg-green-700 text-white shadow-md"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`
            }>
              My Rescues
              {rescueNotifications > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {rescueNotifications}
                </span>
              )}
            </NavLink>
            
            {user?.isAdmin && (
              <>
                <NavLink to="/admin" className={navStyle}>Admin</NavLink>
                <NavLink to="/delivery-hub" className={navStyle}>Delivery Hub</NavLink>
                <NavLink to="/admin/rescue" className={navStyle}>Rescue Mod</NavLink>
              </>
            )}
          </div>

          {/* RIGHT DESKTOP & MOBILE CART/LOGOUT */}
          <div className="hidden lg:flex items-center gap-4">
            <NavLink to="/cart" className={({ isActive }) =>
              `relative p-3 rounded-full transition ${isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100"}`
            }>
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </NavLink>

            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-5 py-2.5 rounded-xl font-bold transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* MOBILE MENU BUTTON & CART */}
          <div className="flex items-center gap-4 lg:hidden">
            <NavLink to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="w-7 h-7" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </NavLink>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none transition"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 absolute w-full shadow-2xl z-40 overflow-hidden">
          <div className="px-4 pt-4 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
            <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Dashboard</NavLink>
            <NavLink to="/shop" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Explore Plants</NavLink>
            <NavLink to="/wishlist" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Wishlist</NavLink>
            <NavLink to="/rescue-map" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Plant Rescue Map</NavLink>
            <NavLink to="/rescue/leaderboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Leaderboard</NavLink>
            <NavLink to="/disease-detection" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>AI Disease Detection</NavLink>
            <NavLink to="/monitor" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Smart Plant Monitor</NavLink>
            
            <NavLink to="/rescue/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) =>
              `relative block px-5 py-4 rounded-2xl transition font-bold text-lg flex items-center justify-between ${
                isActive
                  ? "bg-green-700 text-white shadow-lg"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`
            }>
              <span>My Rescues</span>
              {rescueNotifications > 0 && (
                <span className="bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                  <Bell className="w-3 h-3" /> {rescueNotifications} New
                </span>
              )}
            </NavLink>
            
            {user?.isAdmin && (
              <>
                <div className="pt-2 pb-1"><div className="border-t border-gray-100"></div></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-5">Admin Controls</p>
                <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Admin Panel</NavLink>
                <NavLink to="/delivery-hub" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Delivery Hub</NavLink>
                <NavLink to="/admin/rescue" onClick={() => setMobileMenuOpen(false)} className={mobileNavStyle}>Rescue Moderation</NavLink>
              </>
            )}

            <div className="pt-4 pb-2">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-4 rounded-2xl font-bold text-lg transition">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}