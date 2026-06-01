import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";
import { 
  MapPin, Clock, ArrowLeft, Heart, MessageCircle, Info, 
  ShieldCheck, Loader2, CheckCircle, Tag, Leaf, Flag, QrCode, Navigation, Share2
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function RescueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [requestModal, setRequestModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [message, setMessage] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rescue/${id}`);
      if (res.ok) {
        const data = await res.json();
        setListing(data);
      } else {
        navigate("/rescue-map");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!message) return alert("Please include a message to the owner.");
    setRequesting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/requests/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      
      const data = await res.json();
      if (res.ok) {
        setRequestSuccess(true);
      } else {
        alert(data.message || "Failed to send request.");
        setRequestModal(false);
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setRequesting(false);
    }
  };

  const handleReport = async () => {
    if (!window.confirm("Are you sure you want to report this listing as fake or spam?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/rescue/${id}/report`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Listing reported successfully. Admins will review it.");
      }
    } catch (err) {
      alert("Error reporting listing.");
    }
  };

  if (loading) return (
    <PageWrapper>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    </PageWrapper>
  );

  if (!listing) return null;

  const isOwner = Boolean(currentUser?._id && listing.owner?._id && currentUser._id === listing.owner._id);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
          
          <button onClick={() => navigate("/rescue-map")} className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Map
          </button>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
            
            {/* Left: Images */}
            <div className="md:w-1/2 h-[400px] md:h-auto bg-gray-100 relative">
              <img 
                src={listing.photos[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587'} 
                alt={listing.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md
                  ${listing.status === 'Available' ? 'bg-green-500' : 'bg-amber-500'}`}
                >
                  {listing.status}
                </span>
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md shadow-md">
                  {listing.type} {listing.type === 'Paid' ? `· ₹${listing.price}` : ''}
                </span>
              </div>
            </div>

            {/* Right: Details */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
              
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">{listing.title}</h1>
                <p className="text-lg font-bold text-green-600 flex items-center gap-2">
                  <Leaf className="w-5 h-5" /> {listing.plantName}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{listing.addressString}</span>
                </div>
                {listing.location?.coordinates && (
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${listing.location.coordinates[1]},${listing.location.coordinates[0]}`}
                    target="_blank" rel="noreferrer"
                    className="shrink-0 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <Navigation className="w-4 h-4" /> Get Directions
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Category", val: listing.category, icon: <Tag className="w-4 h-4 text-gray-400" /> },
                  { label: "Health", val: listing.healthCondition, icon: <Heart className="w-4 h-4 text-rose-400" /> },
                  { label: "Difficulty", val: listing.careDifficulty, icon: <ShieldCheck className="w-4 h-4 text-blue-400" /> },
                  { label: "Age", val: listing.age || "Unknown", icon: <Clock className="w-4 h-4 text-amber-400" /> },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                    <span className="text-xs text-gray-400 font-bold mb-1 flex items-center gap-1.5">
                      {item.icon} {item.label}
                    </span>
                    <span className="font-bold text-gray-800 text-sm">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8 flex-1">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500"/> Reason for Rescue</h3>
                <p className="text-gray-600 text-sm leading-relaxed bg-blue-50/50 border border-blue-100 p-4 rounded-2xl italic">
                  "{listing.reason}"
                </p>
              </div>

              {/* Owner Info & Action */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-lg">
                    {listing.owner?.avatar ? <img src={listing.owner.avatar} className="w-full h-full rounded-full" /> : (listing.owner?.name?.charAt(0) || "?")}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Owner</p>
                    <p className="font-bold text-gray-800">{listing.owner?.name || "Unknown"}</p>
                  </div>
                </div>

                {!isOwner && listing.status === "Available" && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShareModal(true)}
                      className="text-gray-400 hover:text-blue-500 p-3 rounded-xl hover:bg-blue-50 transition"
                      title="Share QR Code"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleReport}
                      className="text-gray-400 hover:text-red-500 p-3 rounded-xl hover:bg-red-50 transition"
                      title="Report Spam"
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setRequestModal(true)}
                      className="bg-gray-900 text-white hover:bg-black px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-gray-200"
                    >
                      <MessageCircle className="w-4 h-4" /> Request Plant
                    </button>
                  </div>
                )}
                
                {isOwner && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShareModal(true)}
                      className="text-gray-400 hover:text-blue-500 p-3 rounded-xl hover:bg-blue-50 transition"
                      title="Share QR Code"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => navigate("/rescue/dashboard")}
                      className="px-6 py-3 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-xl font-bold transition flex items-center gap-2"
                    >
                      View Requests for your plant
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* REQUEST MODAL */}
      {requestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {requestSuccess ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">Request Sent!</h2>
                <p className="text-gray-500">The owner will be notified. You can track this request and chat with the owner in your Rescue Dashboard.</p>
                <button 
                  onClick={() => { setRequestModal(false); navigate("/rescue/dashboard"); }}
                  className="w-full mt-4 bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Request to Adopt</h2>
                <p className="text-sm text-gray-500 mb-6">Send a friendly message to {listing.owner?.name || "the owner"} explaining why you'd be a great new parent for this {listing.plantName}.</p>
                
                <textarea 
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Hi! I'd love to adopt this plant because..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition resize-none mb-6"
                />

                <div className="flex gap-3">
                  <button onClick={() => setRequestModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                  <button 
                    onClick={handleRequest}
                    disabled={requesting || !message}
                    className="flex-[2] bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {requesting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Request'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHARE QR MODAL */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4" onClick={() => setShareModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Share Listing</h2>
            <p className="text-sm text-gray-500 mb-6">Scan this QR code to view this plant on any device.</p>
            
            <div className="bg-gray-50 p-6 rounded-2xl inline-block border border-gray-100 mb-6">
              <QRCodeCanvas 
                value={window.location.href}
                size={200}
                bgColor={"#f9fafb"}
                fgColor={"#111827"}
                level={"H"}
                includeMargin={false}
              />
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition"
            >
              Copy Link
            </button>
            <button 
              onClick={() => setShareModal(false)}
              className="w-full mt-3 text-gray-500 font-bold py-2 hover:text-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
