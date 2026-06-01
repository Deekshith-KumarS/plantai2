import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";
import { Map, Loader2, CheckCircle2, MessageCircle, Clock, XCircle, Trash2 } from "lucide-react";

export default function RescueDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-listings"); // my-listings, incoming-requests, outgoing-requests
  
  const [myListings, setMyListings] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch My Listings
      const resListings = await fetch(`${API_URL}/api/rescue/user/me`, { headers });
      if (resListings.ok) setMyListings(await resListings.json());

      // Fetch Requests (Incoming & Outgoing)
      const resRequests = await fetch(`${API_URL}/api/requests/me`, { headers });
      if (resRequests.ok) {
        const data = await resRequests.json();
        setIncoming(data.incoming);
        setOutgoing(data.outgoing);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/rescue/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMyListings(prev => prev.filter(l => l._id !== id));
      } else {
        alert("Failed to delete listing.");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const handleMarkAsRescued = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/rescue/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "Rescued" })
      });
      if (res.ok) {
        setMyListings(prev => prev.map(l => l._id === id ? { ...l, status: "Rescued" } : l));
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/requests/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Optimistic UI update
        setIncoming(prev => prev.map(req => req._id === requestId ? { ...req, status } : req));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'text-green-600 bg-green-50 border-green-200';
      case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'Completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-amber-600 bg-amber-50 border-amber-200';
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Rescue Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your plant listings and adoption requests</p>
            </div>
            <button 
              onClick={() => navigate("/rescue-map")}
              className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
            >
              <Map className="w-4 h-4" /> Open Rescue Map
            </button>
          </div>

          {/* IMPACT METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-green-200">
              <p className="text-green-100 font-bold mb-1">Total Plants Rescued</p>
              <h2 className="text-4xl font-black">124</h2>
              <p className="text-xs text-green-100 mt-2">By the entire community</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
              <p className="text-blue-100 font-bold mb-1">Waste Prevented</p>
              <h2 className="text-4xl font-black">450 kg</h2>
              <p className="text-xs text-blue-100 mt-2">Estimated bio-waste saved</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
              <p className="text-gray-500 font-bold mb-1">Your Contribution</p>
              <h2 className="text-4xl font-black text-gray-800">{myListings.filter(l => l.status === 'Rescued').length}</h2>
              <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Plants successfully adopted</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setActiveTab("my-listings")}
                className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === "my-listings" ? "text-green-600 border-b-2 border-green-600 bg-green-50/30" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                My Listings ({myListings.length})
              </button>
              <button 
                onClick={() => setActiveTab("incoming-requests")}
                className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === "incoming-requests" ? "text-green-600 border-b-2 border-green-600 bg-green-50/30" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                Incoming Requests ({incoming.length})
              </button>
              <button 
                onClick={() => setActiveTab("outgoing-requests")}
                className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === "outgoing-requests" ? "text-green-600 border-b-2 border-green-600 bg-green-50/30" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                My Applications ({outgoing.length})
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                </div>
              ) : (
                <>
                  {/* TAB: MY LISTINGS */}
                  {activeTab === "my-listings" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myListings.length === 0 ? (
                        <div className="col-span-full text-center py-16 text-gray-400">
                          <p>You haven't listed any plants for rescue yet.</p>
                          <button onClick={() => navigate("/rescue/create")} className="mt-4 text-green-600 font-bold hover:underline">List a Plant</button>
                        </div>
                      ) : myListings.map(listing => (
                        <div key={listing._id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col">
                          <div className="h-40 bg-gray-100 relative">
                            <img src={listing.photos[0]} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-gray-800">
                              {listing.status}
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900 line-clamp-1">{listing.title}</h3>
                                <button 
                                  onClick={() => handleDeleteListing(listing._id)}
                                  className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                                  title="Delete Listing"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-green-600 font-bold mb-3">{listing.plantName}</p>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-4 bg-gray-50 p-2 rounded-lg">{listing.reason}</p>
                            </div>
                            
                            <div className="mt-auto flex flex-col gap-2">
                              {listing.status === 'Pending' && (
                                <button 
                                  onClick={() => handleMarkAsRescued(listing._id)}
                                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-green-200"
                                >
                                  <CheckCircle2 className="w-4 h-4"/> Mark as Rescued
                                </button>
                              )}
                              <button 
                                onClick={() => navigate(`/rescue/${listing._id}`)}
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition"
                              >
                                View Listing
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB: INCOMING REQUESTS */}
                  {activeTab === "incoming-requests" && (
                    <div className="space-y-4">
                      {incoming.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">No requests received yet.</div>
                      ) : incoming.map(req => (
                        <div key={req._id} className="border border-gray-100 bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                          <img src={req.listing?.photos?.[0] || 'https://via.placeholder.com/150'} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded border ${getStatusColor(req.status)}`}>
                                {req.status}
                              </span>
                              <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(req.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-gray-800">{req.listing?.title || "Deleted Listing"}</h3>
                            <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-xl flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                                {req.requester.avatar ? <img src={req.requester.avatar} className="w-full h-full rounded-full" /> : req.requester.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-blue-900 mb-0.5">{req.requester.name} requested to adopt:</p>
                                <p className="text-sm text-blue-800 italic">"{req.message}"</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            {req.status === 'Pending' ? (
                              <>
                                <button onClick={() => updateRequestStatus(req._id, 'Accepted')} className="flex-1 sm:w-32 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Accept</button>
                                <button onClick={() => updateRequestStatus(req._id, 'Rejected')} className="flex-1 sm:w-32 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"><XCircle className="w-4 h-4"/> Reject</button>
                              </>
                            ) : req.status === 'Accepted' ? (
                              <button onClick={() => navigate("/rescue/messages")} className="w-full sm:w-32 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"><MessageCircle className="w-4 h-4"/> Message</button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB: OUTGOING REQUESTS */}
                  {activeTab === "outgoing-requests" && (
                    <div className="space-y-4">
                      {outgoing.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                          <p className="text-gray-500 font-medium">You haven't requested any plants yet.</p>
                        </div>
                      ) : outgoing.map(req => {
                        const isDeleted = !req.listing;
                        return (
                          <div key={req._id} className="border border-gray-100 bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-center">
                            {isDeleted ? (
                              <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                                <span className="text-xs text-gray-400 font-bold text-center px-2">Deleted</span>
                              </div>
                            ) : (
                              <img src={req.listing?.photos?.[0]} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" />
                            )}
                            <div className="flex-1 w-full">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded border ${getStatusColor(req.status)}`}>
                                  {req.status}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-800">{isDeleted ? "Listing Removed" : req.listing.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">Owner: <span className="font-bold text-gray-700">{isDeleted ? "Unknown" : req.listing?.owner?.name || "User"}</span></p>
                            </div>
                            <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                              {req.status === 'Accepted' ? (
                                <button onClick={() => navigate("/rescue/messages")} className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-green-200"><MessageCircle className="w-4 h-4"/> Chat with Owner</button>
                              ) : !isDeleted && (
                                <button onClick={() => navigate(`/rescue/${req.listing._id}`)} className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition">View Listing</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
