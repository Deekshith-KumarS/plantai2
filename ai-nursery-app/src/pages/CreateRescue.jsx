import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { MapPin, UploadCloud, Info, Leaf, CheckCircle, Loader2 } from "lucide-react";
import { API_URL } from "../config";

export default function CreateRescue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    plantName: "",
    category: "Indoor",
    healthCondition: "Good",
    careDifficulty: "Easy",
    age: "",
    potSize: "",
    reason: "",
    addressString: "",
    type: "Free",
    price: 0,
    photos: ["https://images.unsplash.com/photo-1416879598555-321fa9473b18?auto=format&fit=crop&q=80&w=600"], // Dummy photo for now (since no real cloud storage setup was specified for this step)
    location: {
      type: "Point",
      coordinates: [0, 0] // [lng, lat]
    }
  });

  const handleLocationDetect = () => {
    setGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          try {
            // Reverse geocoding using Nominatim (OpenStreetMap)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            
            setFormData(prev => ({
              ...prev,
              location: { type: "Point", coordinates: [lng, lat] },
              addressString: data.display_name || "Detected Location"
            }));
          } catch (err) {
            setFormData(prev => ({
              ...prev,
              location: { type: "Point", coordinates: [lng, lat] },
              addressString: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
            }));
          }
          setGettingLocation(false);
        },
        (error) => {
          alert("Failed to get location. Please enter manually.");
          setGettingLocation(false);
        }
      );
    } else {
      alert("Geolocation not supported by this browser.");
      setGettingLocation(false);
    }
  };

  const handleAddressSearch = async () => {
    if (!formData.addressString.trim()) {
      alert("Please enter an address to search.");
      return;
    }
    setSearchingAddress(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.addressString)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setFormData(prev => ({
          ...prev,
          location: { type: "Point", coordinates: [lng, lat] },
          addressString: data[0].display_name // updates input with properly formatted address
        }));
        alert("Location found and coordinates updated!");
      } else {
        alert("Could not find this address. Please try being more specific.");
      }
    } catch (err) {
      alert("Error searching for address.");
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Max size is 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photos: [reader.result] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/rescue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        navigate("/rescue-map");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to create listing");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
          
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Rescue a Plant</h1>
            <p className="text-gray-500 mt-2">Find a new loving home for your plant instead of throwing it away.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Steps indicator */}
            <div className="flex border-b border-gray-100">
              <div className={`flex-1 py-4 text-center font-bold text-sm ${step >= 1 ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}>1. Plant Details</div>
              <div className={`flex-1 py-4 text-center font-bold text-sm ${step >= 2 ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}>2. Condition & Reason</div>
              <div className={`flex-1 py-4 text-center font-bold text-sm ${step >= 3 ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}>3. Location & Post</div>
            </div>

            <div className="p-8 sm:p-12">
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Listing Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Free Monstera looking for a good home"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Plant Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" required
                        value={formData.plantName} onChange={e => setFormData({...formData, plantName: e.target.value})}
                        placeholder="e.g. Monstera Deliciosa"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition bg-white"
                      >
                        <option>Indoor</option>
                        <option>Outdoor</option>
                        <option>Succulent</option>
                        <option>Herb</option>
                        <option>Tree</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Age (Optional)</label>
                      <input 
                        type="text"
                        value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                        placeholder="e.g. 2 years"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Pot Size (Optional)</label>
                      <input 
                        type="text"
                        value={formData.potSize} onChange={e => setFormData({...formData, potSize: e.target.value})}
                        placeholder="e.g. 10 inch ceramic"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!formData.title || !formData.plantName}
                    className="w-full mt-6 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Health Condition <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.healthCondition} onChange={e => setFormData({...formData, healthCondition: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition bg-white"
                      >
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Needs TLC (Tender Loving Care)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Care Difficulty <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.careDifficulty} onChange={e => setFormData({...formData, careDifficulty: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition bg-white"
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Rescue <span className="text-red-500">*</span></label>
                    <textarea 
                      required rows={4}
                      value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}
                      placeholder="e.g. I am moving out of state and cannot take my plants with me."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Listing Type <span className="text-red-500">*</span></label>
                      <div className="flex gap-4">
                        <label className="flex-1">
                          <input type="radio" name="type" value="Free" checked={formData.type === "Free"} onChange={e => setFormData({...formData, type: e.target.value})} className="peer hidden" />
                          <div className="peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600 border-2 border-gray-100 rounded-xl py-3 text-center font-bold text-gray-500 cursor-pointer transition">
                            Free
                          </div>
                        </label>
                        <label className="flex-1">
                          <input type="radio" name="type" value="Paid" checked={formData.type === "Paid"} onChange={e => setFormData({...formData, type: e.target.value})} className="peer hidden" />
                          <div className="peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600 border-2 border-gray-100 rounded-xl py-3 text-center font-bold text-gray-500 cursor-pointer transition">
                            Paid
                          </div>
                        </label>
                        <label className="flex-1">
                          <input type="radio" name="type" value="Exchange" checked={formData.type === "Exchange"} onChange={e => setFormData({...formData, type: e.target.value})} className="peer hidden" />
                          <div className="peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600 border-2 border-gray-100 rounded-xl py-3 text-center font-bold text-gray-500 cursor-pointer transition">
                            Exchange
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.type === "Paid" && (
                        <>
                          <label className="text-sm font-bold text-gray-700">Price (₹) <span className="text-red-500">*</span></label>
                          <input 
                            type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} min="1"
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition font-bold"
                            placeholder="e.g. 500"
                          />
                        </>
                      )}
                      {formData.type === "Exchange" && (
                        <>
                          <label className="text-sm font-bold text-gray-700">Looking for... <span className="text-red-500">*</span></label>
                          <input 
                            type="text" value={formData.exchangePreferences || ""} onChange={e => setFormData({...formData, exchangePreferences: e.target.value})}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition font-bold"
                            placeholder="e.g. Small Snake Plant"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Back</button>
                    <button 
                      onClick={() => setStep(3)}
                      disabled={!formData.reason}
                      className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition disabled:opacity-50"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Photo <span className="text-red-500">*</span></label>
                    
                    <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer flex flex-col items-center justify-center">
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="font-bold text-gray-600">Click to upload photo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>

                    {formData.photos[0] && formData.photos[0] !== "https://images.unsplash.com/photo-1416879598555-321fa9473b18?auto=format&fit=crop&q=80&w=600" && (
                      <div className="mt-4 flex gap-3">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-green-500 shadow-sm">
                          <img src={formData.photos[0]} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-0.5"><CheckCircle className="w-3 h-3"/></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Location <span className="text-red-500">*</span></label>
                    <div className="flex gap-3 mb-3">
                      <button 
                        type="button"
                        onClick={handleLocationDetect}
                        disabled={gettingLocation || searchingAddress}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-bold py-3 px-4 rounded-xl border border-blue-200 hover:bg-blue-100 transition disabled:opacity-50"
                      >
                        {gettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                        {gettingLocation ? "Detecting GPS..." : "Auto Detect"}
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <textarea 
                        required rows={2}
                        value={formData.addressString} onChange={e => setFormData({...formData, addressString: e.target.value})}
                        placeholder="Type full address, city, or landmark..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition resize-none"
                      />
                      <button 
                        type="button"
                        onClick={handleAddressSearch}
                        disabled={searchingAddress || gettingLocation || !formData.addressString}
                        className="bg-gray-900 text-white px-4 rounded-xl font-bold hover:bg-black transition disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                      >
                        {searchingAddress ? <Loader2 className="w-5 h-5 animate-spin" /> : "Find on Map"}
                      </button>
                    </div>
                    
                    {formData.location.coordinates[0] !== 0 && (
                      <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Coordinates pinned: {formData.location.coordinates[1].toFixed(4)}, {formData.location.coordinates[0].toFixed(4)}
                      </p>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>Your exact coordinates will be placed on the map. Interested adopters can message you to confirm the final pickup details.</p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Back</button>
                    <button 
                      onClick={handleSubmit}
                      disabled={loading || !formData.addressString}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:from-green-700 hover:to-emerald-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      Post Rescue Listing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
