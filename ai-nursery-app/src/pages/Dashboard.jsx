import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import RecentlyViewed from "../components/RecentlyViewed";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { API_URL } from "../config";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { cart }     = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  /* ── REAL orders from MongoDB ── */
  const [orders,        setOrders]        = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  /* ── REAL AI insights from Groq ── */
  const [aiInsights,    setAiInsights]    = useState(null);
  const [insightLoading,setInsightLoading]= useState(false);

  const token = localStorage.getItem("token");

  /* Fetch real orders */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch {}
      finally { setOrdersLoading(false); }
    })();
  }, []);

  /* Fetch real AI insights once orders & wishlist are known */
  useEffect(() => {
    if (ordersLoading) return;
    fetchAIInsights();
  }, [ordersLoading]);

  const fetchAIInsights = async () => {
    setInsightLoading(true);
    try {
      const wishNames  = wishlist.slice(0,5).map(p => p.name).join(", ") || "none";
      const orderCount = orders.length;
      const lastOrder  = orders[0]?.items?.map(i => i.name).join(", ") || "none";

      const prompt = `You are PlantAI. A user named "${user?.name || "Plant Lover"}" has:
- ${wishlist.length} plants in their wishlist: ${wishNames}
- ${cart.length} items in cart
- ${orderCount} orders placed, latest items: ${lastOrder}

Give 3 short, personalized plant care or shopping tips (JSON only):
{"bestPick":"<plant name + 1-sentence reason>","careTip":"<specific care tip for their plants>","reminder":"<actionable reminder based on their activity>"}`;

      const res  = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      const match = (data.reply || "").match(/\{[\s\S]*\}/);
      if (match) setAiInsights(JSON.parse(match[0]));
      else throw new Error("bad json");
    } catch {
      /* Fallback based on real context */
      setAiInsights({
        bestPick:  wishlist.length > 0 ? `${wishlist[0].name} — already in your wishlist, a perfect first pick!` : "Snake Plant — ideal for beginners, needs very little water.",
        careTip:   "Water your plants only when the top inch of soil feels dry. Overwatering is the #1 cause of plant death.",
        reminder:  cart.length > 0
          ? `You have ${cart.length} plant${cart.length > 1 ? "s" : ""} in your cart waiting for you!`
          : orders.length > 0
          ? `Your last order has ${orders[0]?.items?.length} plant${orders[0]?.items?.length > 1 ? "s" : ""} — remember to add them to Smart Monitor!`
          : "Add your first plant to the cart and start your green journey today! 🌱",
      });
    } finally { setInsightLoading(false); }
  };

  /* Derived stats */
  const activityScore = wishlist.length + cart.length + orders.length;
  const level      = activityScore >= 10 ? "🥇 Gold" : activityScore >= 5 ? "🥈 Silver" : "🥉 Bronze";
  const levelColor = activityScore >= 10 ? "text-yellow-500" : activityScore >= 5 ? "text-gray-400" : "text-amber-600";
  const co2Saved   = (wishlist.length * 2.4 + orders.length * 5.1).toFixed(1);

  /* Latest order status */
  const latestOrder = orders[0];
  const statusColors = {
    Pending:"bg-yellow-100 text-yellow-700",
    Processing:"bg-blue-100 text-blue-700",
    Shipped:"bg-purple-100 text-purple-700",
    "Out for Delivery":"bg-orange-100 text-orange-700",
    Delivered:"bg-green-100 text-green-700",
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Navbar />

        <div className="p-8 lg:p-16">

          {/* HERO */}
          <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-10 text-white shadow-2xl">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome back, {user?.name || "Plant Lover"} 🌿
            </h1>
            <p className="mt-4 text-xl text-green-100 max-w-2xl leading-relaxed">
              Your personalised plant dashboard — live orders, real AI recommendations, and your plant journey all in one place.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={() => window.location.href="/shop"}
                className="bg-white text-green-700 px-8 py-4 rounded-2xl font-bold hover:bg-green-100 transition shadow-lg">
                Explore Plants
              </button>
              <button onClick={() => window.location.href="/monitor"}
                className="bg-green-600 border border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-800 transition">
                Smart Monitor 🌱
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition duration-300 border-t-4 border-green-500">
              <h2 className={`text-3xl font-bold ${levelColor}`}>{level}</h2>
              <p className="mt-3 text-gray-600 text-lg">Plant Lover Level</p>
              <p className="text-xs text-gray-400 mt-1">Based on your real activity</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition duration-300 border-t-4 border-emerald-400">
              <h2 className="text-4xl font-bold text-emerald-600">{co2Saved} <span className="text-xl">kg</span></h2>
              <p className="mt-3 text-gray-600 text-lg">🌍 CO₂ Offset</p>
              <p className="text-xs text-gray-400 mt-1">Estimated from your plants</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition duration-300 border-t-4 border-pink-400">
              <h2 className="text-4xl font-bold text-pink-500">{wishlist.length}</h2>
              <p className="mt-3 text-gray-600 text-lg">❤️ Saved Plants</p>
              <p className="text-xs text-gray-400 mt-1">On your wishlist</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition duration-300 border-t-4 border-blue-400">
              {ordersLoading
                ? <Loader2 className="w-8 h-8 text-blue-400 animate-spin"/>
                : <h2 className="text-4xl font-bold text-blue-500">{orders.length}</h2>
              }
              <p className="mt-3 text-gray-600 text-lg">📦 Orders Placed</p>
              <p className="text-xs text-gray-400 mt-1">Fetched live from your account</p>
            </div>
          </div>

          {/* LATEST ORDER STATUS */}
          {!ordersLoading && latestOrder && (
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
              className="bg-white rounded-3xl shadow-lg p-8 mt-10 border-l-4 border-green-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Latest Order Status</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Order ID</p>
                  <p className="font-mono text-sm font-bold text-gray-700">#{latestOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Items</p>
                  <p className="font-semibold text-gray-700">{latestOrder.items.map(i=>i.name).join(", ")}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total</p>
                  <p className="font-bold text-green-700">₹{latestOrder.totalAmount}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[latestOrder.status]||"bg-gray-100 text-gray-600"}`}>
                  {latestOrder.status}
                </span>
                <button onClick={() => window.location.href="/cart"}
                  className="ml-auto text-sm text-green-600 font-semibold hover:underline">
                  View All Orders →
                </button>
              </div>
            </motion.div>
          )}

          {/* LIVE AI INSIGHTS */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-green-700 flex items-center gap-3">
                <Sparkles className="w-7 h-7"/> AI Plant Insights
                <span className="text-xs font-normal text-gray-400 ml-1">Personalised by Groq AI</span>
              </h2>
              <button onClick={fetchAIInsights} disabled={insightLoading}
                className="flex items-center gap-2 text-sm text-green-600 font-semibold hover:text-green-800 transition disabled:opacity-40">
                <RefreshCw className={`w-4 h-4 ${insightLoading?"animate-spin":""}`}/> Refresh
              </button>
            </div>

            {insightLoading ? (
              <div className="flex items-center gap-3 text-gray-400 py-8">
                <Loader2 className="w-5 h-5 animate-spin text-green-500"/>
                <span>PlantAI is analysing your activity…</span>
              </div>
            ) : aiInsights ? (
              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
                  className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-green-700 mb-2">🌿 Best Pick For You</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{aiInsights.bestPick}</p>
                </motion.div>
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                  className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-700 mb-2">☀️ Care Tip</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{aiInsights.careTip}</p>
                </motion.div>
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                  className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                  <h3 className="text-lg font-bold text-amber-700 mb-2">💡 Reminder</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{aiInsights.reminder}</p>
                </motion.div>
              </div>
            ) : null}
          </div>

          {/* RECENTLY VIEWED */}
          <RecentlyViewed />

        </div>
      </div>
    </PageWrapper>
  );
}