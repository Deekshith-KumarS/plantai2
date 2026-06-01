import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plus, MapPin, Filter, Leaf, Navigation, X, Check } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";

/* Custom Marker Icon */
const createCustomIcon = (imgUrl) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="width: 44px; height: 44px; background: white; border-radius: 50%; padding: 2px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <img src="${imgUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=200'"/>
      </div>
      <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white; margin: 0 auto;"></div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 52],
    popupAnchor: [0, -52],
  });
};

/* Component to auto-center map when user shares location */
const AutoCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13, { animate: true });
    }
  }, [position, map]);
  return null;
};

export default function RescueMap() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [radius, setRadius] = useState(50); // km

  const fetchListings = async (lat, lng, r) => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/rescue?`;
      if (lat && lng) url += `lat=${lat}&lng=${lng}&radiusInKm=${r}&`;
      if (filterCat !== "All") url += `category=${filterCat}&`;
      if (filterType !== "All") url += `type=${filterType}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error("Error fetching rescue listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation([lat, lng]);
          fetchListings(lat, lng, radius);
        },
        () => {
          // Default to a central location (e.g., Center of India or user's country)
          setUserLocation([20.5937, 78.9629]); 
          fetchListings();
        }
      );
    } else {
      setUserLocation([20.5937, 78.9629]);
      fetchListings();
    }
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (userLocation) {
      fetchListings(userLocation[0], userLocation[1], radius);
    } else {
      fetchListings();
    }
  }, [filterCat, filterType, radius]);

  const categories = ["All", "Indoor", "Outdoor", "Succulent", "Herb", "Tree"];
  const types = ["All", "Free", "Paid", "Exchange"];

  return (
    <PageWrapper>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden relative">
        <Navbar />

        {/* Floating Action Bar */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-[400] flex gap-4 w-full max-w-xl px-4 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 flex items-center justify-between w-full pointer-events-auto border border-white/40">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-semibold transition"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            <h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 hidden sm:block">
              Plant Rescue Map
            </h2>
            <button 
              onClick={() => navigate("/rescue/create")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition"
            >
              <Plus className="w-4 h-4" /> List Plant
            </button>
          </div>
        </div>

        {/* Floating Filters Panel */}
        {showFilters && (
          <div className="absolute top-40 left-4 sm:left-1/2 sm:-translate-x-1/2 z-[400] w-[calc(100%-2rem)] sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Filter className="w-5 h-5 text-green-500"/> Advanced Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-600 block mb-2">Distance Radius: {radius}km</label>
                <input 
                  type="range" min="5" max="500" value={radius} 
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full accent-green-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-600 block mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button 
                      key={c}
                      onClick={() => setFilterCat(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filterCat === c ? 'bg-green-500 text-white border-green-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 block mb-2">Listing Type</label>
                <div className="flex flex-wrap gap-2">
                  {types.map(t => (
                    <button 
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filterType === t ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAP */}
        <div className="flex-1 relative z-0">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[500] flex items-center justify-center">
              <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-5 h-5 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold text-green-700">Loading map...</span>
              </div>
            </div>
          )}
          
          <MapContainer 
            center={userLocation || [20.5937, 78.9629]} 
            zoom={5} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {userLocation && <AutoCenter position={userLocation} />}

            {/* Heatmap Overlay Layer (rendered underneath markers) */}
            {listings.map(listing => (
              <Circle 
                key={`heat-${listing._id}`}
                center={[listing.location.coordinates[1], listing.location.coordinates[0]]} 
                pathOptions={{ color: 'transparent', fillColor: '#16a34a', fillOpacity: 0.15 }} 
                radius={15000} 
              />
            ))}

            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={(cluster) => {
                return L.divIcon({
                  html: `<div style="background-color: #16a34a; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">${cluster.getChildCount()}</div>`,
                  className: "custom-cluster-icon",
                  iconSize: L.point(40, 40, true),
                });
              }}
            >
              {listings.map((listing) => (
                <Marker 
                  key={listing._id} 
                  position={[listing.location.coordinates[1], listing.location.coordinates[0]]}
                  icon={createCustomIcon(listing.photos[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587')}
                >
                  <Popup className="rescue-popup border-0">
                    <div className="w-64 -m-3 overflow-hidden rounded-2xl shadow-xl bg-white">
                      <div className="h-32 w-full bg-gray-100 relative">
                        <img src={listing.photos[0]} alt={listing.plantName} className="w-full h-full object-cover" />
                        <div className={`absolute top-2 left-2 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                          listing.type === 'Free' ? 'bg-green-600/80' :
                          listing.type === 'Exchange' ? 'bg-purple-600/80' :
                          'bg-blue-600/80'
                        }`}>
                          {listing.type === 'Exchange' ? 'Trade' : listing.type} {listing.type === 'Paid' ? `· ₹${listing.price}` : ''}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-extrabold text-lg text-gray-800 leading-tight">{listing.title}</h3>
                        <p className="text-xs text-green-600 font-bold mb-2">{listing.plantName} · {listing.category}</p>
                        
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-xl">
                          <MapPin className="w-3.5 h-3.5 text-red-500"/>
                          <span className="truncate">{listing.addressString}</span>
                        </div>
                        
                        <button 
                          onClick={() => navigate(`/rescue/${listing._id}`)}
                          className="w-full bg-green-100 text-green-700 hover:bg-green-600 hover:text-white py-2.5 rounded-xl font-bold text-sm transition"
                        >
                          View Details & Rescue
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </PageWrapper>
  );
}
