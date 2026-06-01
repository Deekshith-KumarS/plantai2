import { useState, useEffect } from "react";
import { API_URL } from "../config";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { Loader2, Trash2, AlertTriangle, CheckCircle2, TrendingUp, Users } from "lucide-react";

export default function RescueAdminPanel() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, listingsRes] = await Promise.all([
        fetch(`${API_URL}/api/rescue/admin/analytics`, { headers }),
        fetch(`${API_URL}/api/rescue/admin/all`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (listingsRes.ok) setListings(await listingsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this listing?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/rescue/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setListings(prev => prev.filter(l => l._id !== id));
        fetchData(); // Refresh stats
      }
    } catch (err) {
      alert("Error deleting");
    }
  };

  if (loading) return (
    <PageWrapper>
      <Navbar />
      <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-500" /></div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Rescue Moderation</h1>
            <p className="text-gray-500">Manage all community plant listings and monitor spam.</p>
          </div>

          {/* Analytics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Total Listings</p>
                  <h2 className="text-3xl font-black text-gray-800">{stats.totalListings}</h2>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Successful Rescues</p>
                  <h2 className="text-3xl font-black text-gray-800">{stats.totalRescued}</h2>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-200 bg-red-50 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500">Reported Listings</p>
                  <h2 className="text-3xl font-black text-red-600">{stats.totalReported}</h2>
                </div>
              </div>
            </div>
          )}

          {/* Listings Table */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">All Listings Directory</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 border-b border-gray-100">Plant</th>
                    <th className="px-6 py-4 border-b border-gray-100">Owner</th>
                    <th className="px-6 py-4 border-b border-gray-100">Status</th>
                    <th className="px-6 py-4 border-b border-gray-100">Reported</th>
                    <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {listings.map(listing => (
                    <tr key={listing._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-green-600 font-bold">{listing.plantName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800 font-medium">{listing.owner?.name || "Deleted User"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          listing.status === 'Available' ? 'bg-green-100 text-green-700' :
                          listing.status === 'Rescued' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {listing.reported ? (
                          <span className="flex items-center gap-1 text-red-500 font-bold text-xs"><AlertTriangle className="w-4 h-4"/> Yes</span>
                        ) : (
                          <span className="text-gray-400 text-xs">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(listing._id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {listings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No listings found in the database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
