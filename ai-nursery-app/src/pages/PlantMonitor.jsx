import { useState, useEffect, useCallback, useRef } from "react";
import {
  Droplet, Sun, Thermometer, AlertCircle, CheckCircle2, Leaf,
  Plus, X, Loader2, Sparkles, Trash2, Search, Clock, TrendingUp,
  Wind, Activity, ChevronRight, Award, ArrowUp, ArrowDown, Minus,
  FlaskConical, RefreshCw, WifiOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";
import { API_URL } from "../config";

/* ─── Verified image helpers ─── */
const U  = (id)       => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=500`;
const PX = (id, file) => `https://images.pexels.com/photos/${id}/${file}?auto=compress&cs=tinysrgb&w=500`;
const FALLBACK = U("1545241047-6083a3684587");

const IMGS = {
  snake:        U("1545241047-6083a3684587"),
  monstera:     U("1614594975525-e45190c55d0b"),
  fiddleLeaf:   U("1597055958656-2bf2a7a42578"),
  pothos:       U("1512428813834-c702c7702b78"),
  peaceLily:    PX("1407305","pexels-photo-1407305.jpeg"),
  spider:       PX("4503273","pexels-photo-4503273.jpeg"),
  zz:           PX("1005058","pexels-photo-1005058.jpeg"),
  philodendron: U("1598880940080-ff9a29891b85"),
  bamboo:       U("1501004318641-b39e6451bec6"),
  fern:         U("1593691509543-d55182d6f87b"),
  cactus:       U("1459411552884-841db9b3cc2a"),
  aloe:         PX("1084199","pexels-photo-1084199.jpeg"),
  succulent:    PX("1005058","pexels-photo-1005058.jpeg"),
  rose:         PX("56866","garden-rose-red-pink-56866.jpeg"),
  orchid:       PX("931177","pexels-photo-931177.jpeg"),
  lavender:     PX("207518","pexels-photo-207518.jpeg"),
  sunflower:    PX("46216","sunflower-flowers-bright-yellow-46216.jpeg"),
  tulip:        PX("37006","tulips-tulip-field-flowers-red-37006.jpeg"),
  marigold:     PX("2263405","pexels-photo-2263405.jpeg"),
  hibiscus:     U("1533378890784-b6d440a50b0f"),
  jasmine:      U("1518014910564-5bd04dc7de52"),
  herb:         U("1618356679226-236b8b9a5c44"),
  bonsai:       PX("5699665","pexels-photo-5699665.jpeg"),
  tree:         U("1501004318641-b39e6451bec6"),
};

const PLANTS_DB = [
  { name:"Monstera Deliciosa",    category:"Indoor",    sunlight:"Medium", waterFreqHrs:168,  fertilizeFreqHrs:336,  img:IMGS.monstera    },
  { name:"Snake Plant",           category:"Indoor",    sunlight:"Low",    waterFreqHrs:336,  fertilizeFreqHrs:720,  img:IMGS.snake       },
  { name:"Peace Lily",            category:"Indoor",    sunlight:"Low",    waterFreqHrs:72,   fertilizeFreqHrs:336,  img:IMGS.peaceLily   },
  { name:"ZZ Plant",              category:"Indoor",    sunlight:"Low",    waterFreqHrs:336,  fertilizeFreqHrs:720,  img:IMGS.zz          },
  { name:"Pothos",                category:"Indoor",    sunlight:"Low",    waterFreqHrs:120,  fertilizeFreqHrs:336,  img:IMGS.pothos      },
  { name:"Money Plant",           category:"Indoor",    sunlight:"Low",    waterFreqHrs:120,  fertilizeFreqHrs:336,  img:IMGS.pothos      },
  { name:"Fiddle Leaf Fig",       category:"Indoor",    sunlight:"High",   waterFreqHrs:168,  fertilizeFreqHrs:336,  img:IMGS.fiddleLeaf  },
  { name:"Rubber Plant",          category:"Indoor",    sunlight:"Medium", waterFreqHrs:168,  fertilizeFreqHrs:336,  img:IMGS.monstera    },
  { name:"Spider Plant",          category:"Indoor",    sunlight:"Medium", waterFreqHrs:72,   fertilizeFreqHrs:336,  img:IMGS.spider      },
  { name:"Philodendron",          category:"Indoor",    sunlight:"Medium", waterFreqHrs:120,  fertilizeFreqHrs:336,  img:IMGS.philodendron},
  { name:"Dracaena",              category:"Indoor",    sunlight:"Medium", waterFreqHrs:240,  fertilizeFreqHrs:720,  img:IMGS.snake       },
  { name:"Calathea",              category:"Indoor",    sunlight:"Low",    waterFreqHrs:72,   fertilizeFreqHrs:336,  img:IMGS.philodendron},
  { name:"Chinese Evergreen",     category:"Indoor",    sunlight:"Low",    waterFreqHrs:240,  fertilizeFreqHrs:720,  img:IMGS.snake       },
  { name:"Bird of Paradise",      category:"Indoor",    sunlight:"High",   waterFreqHrs:168,  fertilizeFreqHrs:336,  img:IMGS.monstera    },
  { name:"Cast Iron Plant",       category:"Indoor",    sunlight:"Low",    waterFreqHrs:336,  fertilizeFreqHrs:720,  img:IMGS.snake       },
  { name:"Areca Palm",            category:"Indoor",    sunlight:"Medium", waterFreqHrs:120,  fertilizeFreqHrs:336,  img:IMGS.bamboo      },
  { name:"Croton",                category:"Indoor",    sunlight:"High",   waterFreqHrs:72,   fertilizeFreqHrs:336,  img:IMGS.philodendron},
  { name:"Marble Queen Pothos",   category:"Indoor",    sunlight:"Low",    waterFreqHrs:120,  fertilizeFreqHrs:336,  img:IMGS.pothos      },
  { name:"Heartleaf Philodendron",category:"Indoor",    sunlight:"Low",    waterFreqHrs:120,  fertilizeFreqHrs:336,  img:IMGS.philodendron},
  { name:"Aloe Vera",             category:"Succulent", sunlight:"High",   waterFreqHrs:336,  fertilizeFreqHrs:1440, img:IMGS.aloe        },
  { name:"Cactus",                category:"Succulent", sunlight:"High",   waterFreqHrs:504,  fertilizeFreqHrs:1440, img:IMGS.cactus      },
  { name:"Jade Plant",            category:"Succulent", sunlight:"High",   waterFreqHrs:336,  fertilizeFreqHrs:1440, img:IMGS.succulent   },
  { name:"Echeveria",             category:"Succulent", sunlight:"High",   waterFreqHrs:336,  fertilizeFreqHrs:1440, img:IMGS.succulent   },
  { name:"Haworthia",             category:"Succulent", sunlight:"Medium", waterFreqHrs:336,  fertilizeFreqHrs:1440, img:IMGS.succulent   },
  { name:"String of Pearls",      category:"Succulent", sunlight:"High",   waterFreqHrs:336,  fertilizeFreqHrs:1440, img:IMGS.cactus      },
  { name:"Barrel Cactus",         category:"Succulent", sunlight:"High",   waterFreqHrs:720,  fertilizeFreqHrs:2160, img:IMGS.cactus      },
  { name:"Agave",                 category:"Succulent", sunlight:"High",   waterFreqHrs:504,  fertilizeFreqHrs:2160, img:IMGS.cactus      },
  { name:"Rose",                  category:"Flowering", sunlight:"High",   waterFreqHrs:48,   fertilizeFreqHrs:168,  img:IMGS.rose        },
  { name:"Orchid",                category:"Flowering", sunlight:"Medium", waterFreqHrs:168,  fertilizeFreqHrs:336,  img:IMGS.orchid      },
  { name:"Lavender",              category:"Flowering", sunlight:"High",   waterFreqHrs:168,  fertilizeFreqHrs:720,  img:IMGS.lavender    },
  { name:"Sunflower",             category:"Flowering", sunlight:"High",   waterFreqHrs:24,   fertilizeFreqHrs:168,  img:IMGS.sunflower   },
  { name:"Tulip",                 category:"Flowering", sunlight:"High",   waterFreqHrs:48,   fertilizeFreqHrs:168,  img:IMGS.tulip       },
  { name:"Marigold",              category:"Flowering", sunlight:"High",   waterFreqHrs:48,   fertilizeFreqHrs:168,  img:IMGS.marigold    },
  { name:"Jasmine",               category:"Flowering", sunlight:"High",   waterFreqHrs:48,   fertilizeFreqHrs:336,  img:IMGS.jasmine     },
  { name:"Hibiscus",              category:"Flowering", sunlight:"High",   waterFreqHrs:24,   fertilizeFreqHrs:168,  img:IMGS.hibiscus    },
  { name:"Anthurium",             category:"Flowering", sunlight:"Medium", waterFreqHrs:168,  fertilizeFreqHrs:336,  img:IMGS.orchid      },
  { name:"Chrysanthemum",         category:"Flowering", sunlight:"High",   waterFreqHrs:48,   fertilizeFreqHrs:168,  img:IMGS.marigold    },
  { name:"Basil",                 category:"Herb",      sunlight:"High",   waterFreqHrs:24,   fertilizeFreqHrs:336,  img:IMGS.herb        },
  { name:"Mint",                  category:"Herb",      sunlight:"Medium", waterFreqHrs:24,   fertilizeFreqHrs:336,  img:IMGS.herb        },
  { name:"Rosemary",              category:"Herb",      sunlight:"High",   waterFreqHrs:48,   fertilizeFreqHrs:720,  img:IMGS.herb        },
  { name:"Thyme",                 category:"Herb",      sunlight:"High",   waterFreqHrs:72,   fertilizeFreqHrs:720,  img:IMGS.herb        },
  { name:"Cilantro",              category:"Herb",      sunlight:"Medium", waterFreqHrs:24,   fertilizeFreqHrs:336,  img:IMGS.herb        },
  { name:"Parsley",               category:"Herb",      sunlight:"Medium", waterFreqHrs:24,   fertilizeFreqHrs:336,  img:IMGS.herb        },
  { name:"Sage",                  category:"Herb",      sunlight:"High",   waterFreqHrs:48,   fertilizeFreqHrs:720,  img:IMGS.herb        },
  { name:"Boston Fern",           category:"Fern",      sunlight:"Medium", waterFreqHrs:48,   fertilizeFreqHrs:720,  img:IMGS.fern        },
  { name:"Maidenhair Fern",       category:"Fern",      sunlight:"Low",    waterFreqHrs:48,   fertilizeFreqHrs:720,  img:IMGS.fern        },
  { name:"Bird's Nest Fern",      category:"Fern",      sunlight:"Low",    waterFreqHrs:48,   fertilizeFreqHrs:720,  img:IMGS.fern        },
  { name:"Staghorn Fern",         category:"Fern",      sunlight:"Medium", waterFreqHrs:72,   fertilizeFreqHrs:720,  img:IMGS.fern        },
  { name:"Elephant Ear",          category:"Tropical",  sunlight:"Medium", waterFreqHrs:72,   fertilizeFreqHrs:336,  img:IMGS.monstera    },
  { name:"Bamboo Palm",           category:"Tropical",  sunlight:"Medium", waterFreqHrs:72,   fertilizeFreqHrs:336,  img:IMGS.bamboo      },
  { name:"Bamboo",                category:"Tree",      sunlight:"High",   waterFreqHrs:168,  fertilizeFreqHrs:720,  img:IMGS.bamboo      },
  { name:"Bonsai",                category:"Tree",      sunlight:"Medium", waterFreqHrs:48,   fertilizeFreqHrs:336,  img:IMGS.bonsai      },
  { name:"Lucky Bamboo",          category:"Tree",      sunlight:"Low",    waterFreqHrs:168,  fertilizeFreqHrs:720,  img:IMGS.bamboo      },
  { name:"Lemon Tree",            category:"Tree",      sunlight:"High",   waterFreqHrs:72,   fertilizeFreqHrs:336,  img:IMGS.tree        },
  { name:"Air Plant (Tillandsia)",category:"Special",   sunlight:"Medium", waterFreqHrs:72,   fertilizeFreqHrs:720,  img:IMGS.aloe        },
  { name:"Venus Flytrap",         category:"Special",   sunlight:"High",   waterFreqHrs:72,   fertilizeFreqHrs:2160, img:IMGS.cactus      },
  { name:"Prayer Plant",          category:"Special",   sunlight:"Low",    waterFreqHrs:72,   fertilizeFreqHrs:336,  img:IMGS.philodendron},
];

const CATEGORIES    = ["All", ...new Set(PLANTS_DB.map(p => p.category))];
const SITUATION_OPTIONS = [
  "Leaves are turning yellow","Leaves are drooping / wilting","Soil feels dry and cracked",
  "Brown tips on leaves","Plant is growing slowly","White spots / powdery residue on leaves",
  "Roots coming out of the pot","Plant looks healthy overall","Leaves are falling off",
  "Fungus gnats or pests noticed","Other (describe below)",
];

/* ── helpers ── */
const getHealthColor = s => s>=70?"#16a34a":s>=40?"#f59e0b":"#ef4444";
const getHealthBg    = s => s>=70?"from-green-500 to-emerald-400":s>=40?"from-yellow-500 to-amber-400":"from-red-500 to-rose-400";
const getMoistureBg  = m => m<30?"from-red-400 to-rose-500":m>70?"from-blue-400 to-cyan-500":"from-green-400 to-emerald-500";
const getMoistureText= m => m<30?"text-red-500":m>70?"text-blue-500":"text-emerald-600";
const getStatusBadge = m => m<30
  ?{label:"Needs Water",  cls:"bg-red-100 text-red-700 border-red-200"}
  :m>=70
  ?{label:"Excellent",    cls:"bg-emerald-100 text-emerald-700 border-emerald-200"}
  :{label:"Good",         cls:"bg-amber-100 text-amber-700 border-amber-200"};

const timeSince = ts => {
  if(!ts) return "Never";
  const d=Date.now()-ts, m=Math.floor(d/60000), h=Math.floor(d/3600000), dy=Math.floor(d/86400000);
  if(m<1) return "Just now";
  if(m<60) return `${m} min${m>1?"s":""} ago`;
  if(h<24) return `${h} hr${h>1?"s":""} ago`;
  return `${dy} day${dy>1?"s":""} ago`;
};
const nextIn = (ts,freq) => {
  if(!ts) return "Now";
  const d=(ts+freq*3600000)-Date.now();
  if(d<=0) return "Overdue";
  const h=Math.floor(d/3600000),dy=Math.floor(d/86400000);
  if(h<1) return "<1 hr"; if(h<24) return `${h} hrs`;
  return `${dy} day${dy>1?"s":""}`;
};
const isOverdue = (ts,freq)=>!ts||(Date.now()-ts)>=freq*3600000;
const decayRate = freq => 80/(freq*360);
const diffVal = (o,n)=>{const d=Math.round(n-o);return d>0?{d:`+${d}`,c:"text-emerald-600",I:ArrowUp,bg:"bg-emerald-50"}:d<0?{d:`${d}`,c:"text-red-500",I:ArrowDown,bg:"bg-red-50"}:{d:"0",c:"text-gray-400",I:Minus,bg:"bg-gray-50"};};

/* ── API helpers ── */
const authHeader = () => ({ "Content-Type":"application/json", Authorization:`Bearer ${localStorage.getItem("token")}` });

export default function PlantMonitor() {
  const [plants,        setPlants]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);  // debounced background save
  const [apiError,      setApiError]      = useState(false);
  const [showForm,      setShowForm]      = useState(false);
  const [analyzing,     setAnalyzing]     = useState(false);
  const [analysisResult,setAnalysisResult]= useState(null);
  const [filterCat,     setFilterCat]     = useState("All");
  const [searchQ,       setSearchQ]       = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [dupPlant,      setDupPlant]      = useState(null);
  const [wateringId,    setWateringId]    = useState(null);
  const [fertilizingId, setFertilizingId] = useState(null);
  const [,              tick]             = useState(0);
  const [form,          setForm]          = useState({plantName:"",height:"",lastWatered:"",lastFertilized:"",situation:"",customSituation:""});
  const decayTimerRef = useRef(null);

  /* ── Load plants from MongoDB ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/monitored-plants`, { headers: authHeader() });
        if (!res.ok) throw new Error("auth");
        const data = await res.json();
        setPlants(data);
      } catch {
        setApiError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Live clock refresh every 30s ── */
  useEffect(() => {
    const t = setInterval(() => tick(n=>n+1), 30000);
    return () => clearInterval(t);
  }, []);

  /* ── Moisture decay — runs locally every 10s, saves to DB every 2 min ── */
  useEffect(() => {
    const decayTimer = setInterval(() => {
      setPlants(prev => prev.map(p => ({
        ...p,
        moisture: Math.max(0, parseFloat((p.moisture - decayRate(p.waterFreqHrs||120)).toFixed(3))),
      })));
    }, 10000);

    /* Save decayed moisture to DB every 2 minutes */
    const saveTimer = setInterval(() => {
      setPlants(prev => {
        prev.forEach(p => {
          fetch(`${API_URL}/api/monitored-plants/${p._id}`, {
            method:"PUT", headers: authHeader(),
            body: JSON.stringify({ moisture: p.moisture }),
          }).catch(()=>{});
        });
        return prev;
      });
    }, 120000);

    return () => { clearInterval(decayTimer); clearInterval(saveTimer); };
  }, []);

  /* ── WATER — update locally + save to MongoDB ── */
  const handleWater = useCallback(async (plant) => {
    setWateringId(plant._id);
    const updates = { moisture: 100, lastWateredAt: Date.now() };
    setPlants(prev => prev.map(p => p._id===plant._id ? {...p,...updates} : p));
    setTimeout(() => setWateringId(null), 1200);
    try {
      await fetch(`${API_URL}/api/monitored-plants/${plant._id}`, {
        method:"PUT", headers: authHeader(), body: JSON.stringify(updates),
      });
    } catch {}
  }, []);

  /* ── FERTILIZE — update locally + save to MongoDB ── */
  const handleFertilize = useCallback(async (plant) => {
    setFertilizingId(plant._id);
    const updates = { fertilizerLevel: 100, lastFertilizedAt: Date.now() };
    setPlants(prev => prev.map(p => p._id===plant._id ? {...p,...updates} : p));
    setTimeout(() => setFertilizingId(null), 1200);
    try {
      await fetch(`${API_URL}/api/monitored-plants/${plant._id}`, {
        method:"PUT", headers: authHeader(), body: JSON.stringify(updates),
      });
    } catch {}
  }, []);

  /* ── DELETE — from local state + MongoDB ── */
  const handleDelete = async (plant) => {
    if (!window.confirm("Remove this plant from your monitor?")) return;
    setPlants(prev => prev.filter(p => p._id!==plant._id));
    try {
      await fetch(`${API_URL}/api/monitored-plants/${plant._id}`, {
        method:"DELETE", headers: authHeader(),
      });
    } catch {}
  };

  const daysSince = d => {
    if(!d) return "unknown";
    const diff=Math.floor((Date.now()-new Date(d))/86400000);
    return diff===0?"today":`${diff} day${diff>1?"s":""} ago`;
  };

  const filteredDB = PLANTS_DB.filter(p => {
    const mc = filterCat==="All"||p.category===filterCat;
    const mq = p.name.toLowerCase().includes(searchQ.toLowerCase());
    return mc&&mq;
  });

  /* ── ANALYZE ── */
  const handleAnalyze = async () => {
    const situation = form.situation==="Other (describe below)" ? form.customSituation : form.situation;
    if(!form.plantName||!form.height||!form.lastWatered||!form.lastFertilized||!situation){
      alert("Please fill in all fields."); return;
    }
    setAnalyzing(true); setAnalysisResult(null); setDupPlant(null);
    const existing = plants.find(p=>p.name.toLowerCase()===form.plantName.toLowerCase());
    if(existing) setDupPlant(existing);

    const prompt=`You are PlantAI. Respond ONLY with valid JSON.\nPlant: ${form.plantName}, Height: ${form.height}cm, Last Watered: ${daysSince(form.lastWatered)}, Last Fertilized: ${daysSince(form.lastFertilized)}, Situation: ${situation}\nJSON: {"healthScore":<0-100>,"moisture":<0-100>,"fertilizerLevel":<0-100>,"growthProgress":<0-100>,"status":"<Excellent|Good|Needs Attention>","tips":["<tip1>","<tip2>","<tip3>"],"summary":"<one sentence>"}`;
    try {
      const r=await fetch(`${API_URL}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:prompt})});
      const d=await r.json();
      const m=(d.reply||"").match(/\{[\s\S]*\}/);
      if(!m) throw new Error("bad");
      setAnalysisResult(JSON.parse(m[0]));
    } catch {
      const dw=Math.floor((Date.now()-new Date(form.lastWatered))/86400000);
      const df=Math.floor((Date.now()-new Date(form.lastFertilized))/86400000);
      const moisture=Math.max(5,Math.min(95,100-dw*10));
      const fertilizerLevel=Math.max(10,Math.min(95,100-df*3));
      const growthProgress=Math.min(95,parseInt(form.height)/2);
      const healthScore=Math.round((moisture+fertilizerLevel+growthProgress)/3);
      setAnalysisResult({healthScore,moisture,fertilizerLevel,growthProgress,
        status:healthScore>=70?"Excellent":healthScore>=40?"Good":"Needs Attention",
        tips:["Water regularly based on soil dryness","Fertilize every 2–4 weeks","Ensure adequate sunlight"],
        summary:"Analysis computed from your inputs."});
    } finally { setAnalyzing(false); }
  };

  /* ── ADD or UPDATE to MongoDB ── */
  const handleAddOrUpdate = async () => {
    if(!analysisResult) return;
    setSaving(true);
    const waterFreqHrs     = selectedPlant?.waterFreqHrs     || 120;
    const fertilizeFreqHrs = selectedPlant?.fertilizeFreqHrs || 336;
    const payload = {
      name:             form.plantName,
      image:            selectedPlant?.img || FALLBACK,
      height:           form.height,
      sunlight:         selectedPlant?.sunlight || "Medium",
      temperature:      22,
      waterFreqHrs,     fertilizeFreqHrs,
      moisture:         analysisResult.moisture,
      fertilizerLevel:  analysisResult.fertilizerLevel,
      growthProgress:   analysisResult.growthProgress,
      healthScore:      analysisResult.healthScore,
      tips:             analysisResult.tips,
      lastWateredAt:    form.lastWatered    ? new Date(form.lastWatered).getTime()    : null,
      lastFertilizedAt: form.lastFertilized ? new Date(form.lastFertilized).getTime() : null,
    };
    try {
      if(dupPlant) {
        /* UPDATE */
        const r = await fetch(`${API_URL}/api/monitored-plants/${dupPlant._id}`,{
          method:"PUT", headers:authHeader(), body:JSON.stringify(payload),
        });
        const updated = await r.json();
        setPlants(prev=>prev.map(p=>p._id===dupPlant._id?updated:p));
      } else {
        /* CREATE */
        const r = await fetch(`${API_URL}/api/monitored-plants`,{
          method:"POST", headers:authHeader(), body:JSON.stringify(payload),
        });
        const created = await r.json();
        setPlants(prev=>[created,...prev]);
      }
    } catch {
      alert("Could not save plant. Please try again.");
    } finally {
      setSaving(false);
      setShowForm(false); setAnalysisResult(null); setSelectedPlant(null); setDupPlant(null);
      setForm({plantName:"",height:"",lastWatered:"",lastFertilized:"",situation:"",customSituation:""});
      setSearchQ(""); setFilterCat("All");
    }
  };

  /* Stats */
  const overallScore = plants.length ? Math.round(plants.reduce((s,p)=>s+(p.healthScore||p.moisture),0)/plants.length) : 0;
  const avgMoisture  = plants.length ? Math.round(plants.reduce((s,p)=>s+p.moisture,0)/plants.length) : 0;
  const excellent    = plants.filter(p=>p.moisture>=70).length;
  const waterOverdue = plants.filter(p=>isOverdue(p.lastWateredAt,p.waterFreqHrs||120)).length;
  const fertOverdue  = plants.filter(p=>isOverdue(p.lastFertilizedAt,p.fertilizeFreqHrs||336)).length;

  /* ════════════════════════════ RENDER ════════════════════════════ */
  return (
    <PageWrapper>
      <div className="min-h-screen" style={{background:"linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)"}}>
        <Navbar/>

        {/* HERO */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 pt-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-400/20 backdrop-blur flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-400"/>
                  </div>
                  <span className="text-green-400 font-semibold text-sm tracking-widest uppercase">Live Monitoring</span>
                  {saving && <span className="text-xs text-blue-300 animate-pulse">⏳ Saving…</span>}
                  {apiError && <span className="flex items-center gap-1 text-xs text-red-400"><WifiOff className="w-3 h-3"/> Offline mode</span>}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">🌿 Smart Plant<br/>Health Monitor</h1>
                <p className="text-slate-300 text-lg mt-3 max-w-lg">
                  {apiError
                    ? "Running in offline mode — changes will not be saved."
                    : "Your plants are saved to your account and sync across all devices."}
                </p>
              </div>
              <button onClick={()=>{setShowForm(true);setAnalysisResult(null);setDupPlant(null);}}
                className="group flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-7 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-green-900/40 transition-all duration-300 hover:scale-105 self-start md:self-auto">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"/>
                Analyze My Plant
              </button>
            </div>

            {/* STAT CARDS */}
            {!loading && plants.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
                {[
                  {icon:<Award className="w-5 h-5"/>,        color:"text-green-400",  bg:"bg-green-400/10",  label:"Health Score",    value:`${overallScore}/100`},
                  {icon:<Droplet className="w-5 h-5"/>,       color:"text-blue-400",   bg:"bg-blue-400/10",   label:"Avg Moisture",    value:`${avgMoisture}%`    },
                  {icon:<CheckCircle2 className="w-5 h-5"/>,  color:"text-emerald-400",bg:"bg-emerald-400/10",label:"Thriving",        value:excellent            },
                  {icon:<AlertCircle className="w-5 h-5"/>,   color:"text-red-400",    bg:"bg-red-400/10",    label:"Need Water",      value:waterOverdue         },
                  {icon:<FlaskConical className="w-5 h-5"/>,  color:"text-purple-400", bg:"bg-purple-400/10", label:"Need Fertilizer", value:fertOverdue          },
                ].map(({icon,color,bg,label,value})=>(
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color} flex-shrink-0`}>{icon}</div>
                    <div>
                      <p className="text-slate-400 text-[11px] font-medium">{label}</p>
                      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-[2rem]"/>
        </div>

        {/* PLANT CARDS */}
        <div className="bg-gray-50 min-h-screen pt-4">
          <div className="max-w-7xl mx-auto px-6 pb-16">

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-green-500 animate-spin"/>
                <p className="text-gray-500 font-semibold">Loading your plants from account…</p>
              </div>
            )}

            {/* Empty — no demo plants, genuine empty state */}
            {!loading && plants.length === 0 && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-24">
                <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🌱</span>
                </div>
                <p className="text-2xl font-bold text-gray-700">No plants monitored yet</p>
                <p className="text-gray-400 mt-2 mb-8 max-w-sm mx-auto">
                  Add your first plant using AI analysis. Your data is saved to your account and available everywhere.
                </p>
                <button onClick={()=>setShowForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold transition shadow-lg">
                  + Analyze My First Plant
                </button>
              </motion.div>
            )}

            {/* Plant grid */}
            {!loading && plants.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plants.map((plant, i) => {
                  const badge      = getStatusBadge(plant.moisture);
                  const score      = Math.round(plant.healthScore||plant.moisture);
                  const waterDue   = isOverdue(plant.lastWateredAt, plant.waterFreqHrs||120);
                  const fertDue    = isOverdue(plant.lastFertilizedAt, plant.fertilizeFreqHrs||336);
                  const isW        = wateringId===plant._id;
                  const isF        = fertilizingId===plant._id;
                  const mPct       = Math.round(plant.moisture);

                  return (
                    <motion.div key={plant._id}
                      initial={{opacity:0,y:40}} animate={{opacity:1,y:0}}
                      transition={{duration:0.45,delay:i*0.07}}
                      className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">

                      {/* IMAGE */}
                      <div className="relative h-48 overflow-hidden">
                        <img src={plant.image} alt={plant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e=>{e.target.onerror=null;e.target.src=FALLBACK;}}/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
                        <button onClick={()=>handleDelete(plant)}
                          className="absolute top-3 left-3 w-8 h-8 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                          title="Remove plant"><Trash2 className="w-3.5 h-3.5"/></button>
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${badge.cls}`}>{badge.label}</div>
                        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between">
                          <div>
                            <h2 className="text-white font-bold text-lg drop-shadow">{plant.name}</h2>
                            <p className="text-white/70 text-xs">{plant.sunlight} Light · {plant.height?`${plant.height}cm`:"—"}</p>
                          </div>
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"/>
                              <motion.circle cx="22" cy="22" r="18" fill="none" stroke={getHealthColor(score)} strokeWidth="4"
                                initial={{strokeDasharray:"0 113"}} animate={{strokeDasharray:`${(score/100)*113} 113`}}
                                transition={{duration:1.2}} strokeLinecap="round"/>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{score}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="p-5 space-y-4">
                        {/* Water + Fertilizer info */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className={`rounded-xl px-3 py-2.5 ${waterDue?"bg-red-50 border border-red-100":"bg-blue-50 border border-blue-100"}`}>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Clock className={`w-3 h-3 ${waterDue?"text-red-500":"text-blue-500"}`}/>
                              <p className={`text-[11px] font-bold ${waterDue?"text-red-600":"text-blue-600"}`}>
                                {waterDue?"Water Overdue!":"Watered"}
                              </p>
                            </div>
                            <p className={`text-[10px] ${waterDue?"text-red-500":"text-blue-500"}`}>{timeSince(plant.lastWateredAt)}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Next: {nextIn(plant.lastWateredAt,plant.waterFreqHrs||120)}</p>
                          </div>
                          <div className={`rounded-xl px-3 py-2.5 ${fertDue?"bg-orange-50 border border-orange-100":"bg-purple-50 border border-purple-100"}`}>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <FlaskConical className={`w-3 h-3 ${fertDue?"text-orange-500":"text-purple-500"}`}/>
                              <p className={`text-[11px] font-bold ${fertDue?"text-orange-600":"text-purple-600"}`}>
                                {fertDue?"Fertilize Due!":"Fertilized"}
                              </p>
                            </div>
                            <p className={`text-[10px] ${fertDue?"text-orange-500":"text-purple-500"}`}>{timeSince(plant.lastFertilizedAt)}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Next: {nextIn(plant.lastFertilizedAt,plant.fertilizeFreqHrs||336)}</p>
                          </div>
                        </div>

                        {/* Bars */}
                        {[
                          {label:"Soil Moisture",  icon:<Droplet className="w-3.5 h-3.5 text-blue-400"/>,    val:mPct,               bar:getMoistureBg(plant.moisture), text:getMoistureText(plant.moisture)},
                          {label:"Fertilizer",     icon:<FlaskConical className="w-3.5 h-3.5 text-purple-400"/>,val:plant.fertilizerLevel,bar:"from-purple-400 to-violet-500",text:"text-purple-600"},
                          {label:"Growth Progress",icon:<TrendingUp className="w-3.5 h-3.5 text-emerald-400"/>,val:plant.growthProgress, bar:"from-emerald-400 to-green-500",text:"text-emerald-600"},
                        ].map(({label,icon,val,bar,text})=>(
                          <div key={label}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">{icon} {label}</span>
                              <span className={`text-xs font-bold ${text}`}>{Math.round(val||0)}%</span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div animate={{width:`${Math.round(val||0)}%`}} transition={{duration:0.8}}
                                className={`h-full rounded-full bg-gradient-to-r ${bar}`}/>
                            </div>
                          </div>
                        ))}

                        {/* Chips */}
                        <div className="flex gap-2">
                          {[
                            {icon:<Thermometer className="w-3.5 h-3.5 text-orange-500"/>,bg:"bg-orange-50",label:"Temp",val:`${plant.temperature}°C`},
                            {icon:<Sun className="w-3.5 h-3.5 text-yellow-500"/>,bg:"bg-yellow-50",label:"Light",val:plant.sunlight},
                            {icon:<Wind className="w-3.5 h-3.5 text-cyan-500"/>,bg:"bg-cyan-50",label:"Humidity",val:"Med"},
                          ].map(({icon,bg,label,val})=>(
                            <div key={label} className={`flex-1 ${bg} rounded-xl px-2 py-2 flex items-center gap-1.5`}>
                              {icon}
                              <div><p className="text-[9px] text-gray-400">{label}</p><p className="text-xs font-bold text-gray-700">{val}</p></div>
                            </div>
                          ))}
                        </div>

                        {/* Tips */}
                        {plant.tips?.length>0&&(
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100">
                            <p className="text-xs font-bold text-green-700 mb-1.5 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5"/> AI Care Tips</p>
                            <ul className="space-y-1">
                              {plant.tips.slice(0,2).map((t,i)=>(
                                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                  <ChevronRight className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0"/>{t}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* BUTTONS */}
                        <div className="grid grid-cols-2 gap-2">
                          <AnimatePresence mode="wait">
                            {isW?(
                              <motion.div key="w-a" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs">
                                <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}><Droplet className="w-3.5 h-3.5"/></motion.div>
                                Watering…
                              </motion.div>
                            ):waterDue?(
                              <motion.button key="w-d" onClick={()=>handleWater(plant)} whileTap={{scale:0.96}}
                                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 transition">
                                <Droplet className="w-3.5 h-3.5"/> Water Now
                              </motion.button>
                            ):(
                              <div key="w-o" className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-gray-50 text-gray-400 text-xs border border-gray-100 cursor-default">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400"/><span>Watered ✓</span>
                              </div>
                            )}
                          </AnimatePresence>
                          <AnimatePresence mode="wait">
                            {isF?(
                              <motion.div key="f-a" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs">
                                <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}><FlaskConical className="w-3.5 h-3.5"/></motion.div>
                                Fertilizing…
                              </motion.div>
                            ):fertDue?(
                              <motion.button key="f-d" onClick={()=>handleFertilize(plant)} whileTap={{scale:0.96}}
                                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition">
                                <FlaskConical className="w-3.5 h-3.5"/> Fertilize
                              </motion.button>
                            ):(
                              <div key="f-o" className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-gray-50 text-gray-400 text-xs border border-gray-100 cursor-default">
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400"/><span>Fertilized ✓</span>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ ANALYZE MODAL ══════════ */}
      <AnimatePresence>
        {showForm&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}
              transition={{type:"spring",stiffness:300,damping:30}}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-7">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2"><Sparkles className="w-6 h-6 text-green-500"/> AI Plant Analyzer</h2>
                    <p className="text-sm text-gray-400 mt-1">Results are saved to your account</p>
                  </div>
                  <button onClick={()=>{setShowForm(false);setAnalysisResult(null);setSelectedPlant(null);setDupPlant(null);setSearchQ("");}}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"><X className="w-4 h-4"/></button>
                </div>

                {!analysisResult?(
                  <div className="space-y-6">
                    {/* Plant picker */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">🌿 Select Plant <span className="text-gray-400 font-normal">({PLANTS_DB.length} available)</span></label>
                      <div className="flex gap-2 mb-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400"/>
                          <input type="text" placeholder="Search plant name…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"/>
                        </div>
                        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)}
                          className="border border-gray-200 rounded-2xl px-3 py-2.5 text-sm outline-none focus:border-green-400 bg-white">
                          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                        </select>
                      </div>

                      {selectedPlant?(
                        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
                          className="flex items-center gap-4 bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                          <img src={selectedPlant.img} alt={selectedPlant.name}
                            className="w-16 h-16 rounded-xl object-cover shadow"
                            onError={e=>{e.target.onerror=null;e.target.src=FALLBACK;}}/>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">{selectedPlant.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {selectedPlant.category} · {selectedPlant.sunlight} Light · Water every {Math.round((selectedPlant.waterFreqHrs||120)/24)} days · Fertilize every {Math.round((selectedPlant.fertilizeFreqHrs||336)/24)} days
                            </p>
                            {plants.some(p=>p.name.toLowerCase()===selectedPlant.name.toLowerCase())&&(
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 w-fit">
                                <RefreshCw className="w-3 h-3"/> Already in your monitor — will update existing card
                              </div>
                            )}
                          </div>
                          <button onClick={()=>{setSelectedPlant(null);setForm(f=>({...f,plantName:""}));}}
                            className="text-gray-400 hover:text-red-400 transition"><X className="w-4 h-4"/></button>
                        </motion.div>
                      ):(
                        <div className="border border-gray-200 rounded-2xl overflow-hidden">
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-3">
                            {filteredDB.map(p=>{
                              const inMonitor=plants.some(mp=>mp.name.toLowerCase()===p.name.toLowerCase());
                              return(
                                <button key={p.name} onClick={()=>{setSelectedPlant(p);setForm(f=>({...f,plantName:p.name}));}}
                                  className="relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 border-transparent hover:border-green-400 hover:bg-green-50 transition group text-center">
                                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      onError={e=>{e.target.onerror=null;e.target.src=FALLBACK;}}/>
                                  </div>
                                  <span className="text-[11px] font-medium text-gray-600 leading-tight line-clamp-2">{p.name}</span>
                                  {inMonitor&&<span className="absolute top-1 right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center"><RefreshCw className="w-2 h-2 text-white"/></span>}
                                </button>
                              );
                            })}
                            {filteredDB.length===0&&<div className="col-span-4 text-center py-8 text-gray-400 text-sm">No plants found.</div>}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">📏 Plant Height (cm)</label>
                      <input type="number" min="1" max="1000" placeholder="e.g. 35" value={form.height} onChange={e=>setForm({...form,height:e.target.value})}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"/>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">💧 Last Watered</label>
                        <input type="date" max={new Date().toISOString().split("T")[0]} value={form.lastWatered} onChange={e=>setForm({...form,lastWatered:e.target.value})}
                          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"/>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">🌿 Last Fertilized</label>
                        <input type="date" max={new Date().toISOString().split("T")[0]} value={form.lastFertilized} onChange={e=>setForm({...form,lastFertilized:e.target.value})}
                          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"/>
                      </div>
                    </div>

                    {/* Situation */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">🔍 Current Situation</label>
                      <select value={form.situation} onChange={e=>setForm({...form,situation:e.target.value})}
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-400 bg-white">
                        <option value="">-- Select a situation --</option>
                        {SITUATION_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                      {form.situation==="Other (describe below)"&&(
                        <textarea rows={3} placeholder="Describe what you observe…" value={form.customSituation} onChange={e=>setForm({...form,customSituation:e.target.value})}
                          className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-400 resize-none"/>
                      )}
                    </div>

                    <button onClick={handleAnalyze} disabled={analyzing}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-200 disabled:opacity-50">
                      {analyzing?<><Loader2 className="w-5 h-5 animate-spin"/>Analyzing…</>:<><Sparkles className="w-5 h-5"/>Analyze with AI</>}
                    </button>

                    {analyzing&&(
                      <motion.div initial={{opacity:0}} animate={{opacity:1}}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100">
                        <div className="flex justify-center gap-1.5 mb-4">
                          {[0,1,2,3,4,5].map(i=>(
                            <motion.div key={i} className="w-2.5 h-2.5 bg-green-500 rounded-full"
                              animate={{y:[0,-14,0],opacity:[0.5,1,0.5]}} transition={{duration:0.8,delay:i*0.12,repeat:Infinity}}/>
                          ))}
                        </div>
                        <p className="font-bold text-green-800">🤖 PlantAI is analyzing your plant…</p>
                        <p className="text-gray-400 text-sm mt-1">Processing data & generating care plan</p>
                      </motion.div>
                    )}
                  </div>

                ):(
                  /* RESULTS */
                  <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="space-y-5">
                    <div className={`bg-gradient-to-r ${getHealthBg(analysisResult.healthScore)} rounded-2xl p-5 text-white`}>
                      <div className="flex items-center gap-4">
                        {selectedPlant&&<img src={selectedPlant.img} alt={form.plantName}
                          className="w-16 h-16 rounded-2xl object-cover border-4 border-white/30 shadow-lg flex-shrink-0"
                          onError={e=>{e.target.onerror=null;e.target.src=FALLBACK;}}/>}
                        <div className="flex-1">
                          {dupPlant?<p className="text-xs opacity-80 flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Updating existing plant</p>
                            :<p className="text-xs opacity-80">Analysis Complete</p>}
                          <h3 className="text-2xl font-extrabold">{form.plantName}</h3>
                          <p className="text-xs opacity-80 mt-1">{analysisResult.summary}</p>
                        </div>
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="6"/>
                            <motion.circle cx="32" cy="32" r="26" fill="none" stroke="white" strokeWidth="6"
                              initial={{strokeDasharray:"0 163"}} animate={{strokeDasharray:`${(analysisResult.healthScore/100)*163} 163`}}
                              transition={{duration:1.5}} strokeLinecap="round"/>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold text-white">{analysisResult.healthScore}</span>
                            <span className="text-[10px] text-white/70">/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Diff comparison */}
                    {dupPlant&&(
                      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                        className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <p className="text-xs font-bold text-amber-700 mb-3 flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5"/> Changes vs. current data</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {label:"Health",  old:dupPlant.healthScore||0,    newV:analysisResult.healthScore,     unit:"pts"},
                            {label:"Moisture",old:Math.round(dupPlant.moisture||0), newV:analysisResult.moisture,   unit:"%"  },
                            {label:"Fertilizer",old:dupPlant.fertilizerLevel||0, newV:analysisResult.fertilizerLevel,unit:"%"  },
                          ].map(({label,old,newV,unit})=>{
                            const {d,c,I,bg}=diffVal(old,newV);
                            return(
                              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                                <p className="text-[10px] text-gray-500 font-medium mb-1">{label}</p>
                                <p className="text-xs text-gray-400">{Math.round(old)}{unit} → <span className="font-bold text-gray-700">{Math.round(newV)}{unit}</span></p>
                                <div className={`flex items-center justify-center gap-0.5 mt-1 ${c} font-bold text-sm`}><I className="w-3.5 h-3.5"/>{d}{unit}</div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Metric bars */}
                    <div className="space-y-4">
                      {[
                        {label:"Soil Moisture",  val:analysisResult.moisture,        bar:"from-blue-400 to-cyan-500",    text:"text-blue-600",   icon:<Droplet className="w-4 h-4 text-blue-400"/>       },
                        {label:"Fertilizer Level",val:analysisResult.fertilizerLevel,bar:"from-purple-400 to-violet-500",text:"text-purple-600", icon:<FlaskConical className="w-4 h-4 text-purple-400"/>},
                        {label:"Growth Progress", val:analysisResult.growthProgress, bar:"from-emerald-400 to-green-500",text:"text-emerald-600",icon:<TrendingUp className="w-4 h-4 text-emerald-400"/>  },
                      ].map(({label,val,bar,text,icon})=>(
                        <div key={label}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">{icon} {label}</span>
                            <span className={`text-sm font-bold ${text}`}>{Math.round(val)}%</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width:`${val}%`}} transition={{duration:1.2,ease:"easeOut"}}
                              className={`h-full rounded-full bg-gradient-to-r ${bar}`}/>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                      <p className="font-bold text-green-800 mb-3 flex items-center gap-1.5"><Sparkles className="w-4 h-4"/> AI Care Recommendations</p>
                      <ul className="space-y-2">
                        {analysisResult.tips.map((tip,i)=>(
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">{i+1}</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={()=>{setAnalysisResult(null);setDupPlant(null);}}
                        className="py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition text-sm">← Re-analyze</button>
                      <button onClick={handleAddOrUpdate} disabled={saving}
                        className="py-3.5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-700 hover:to-emerald-600 transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-60">
                        {saving?<><Loader2 className="w-4 h-4 animate-spin"/>Saving…</>
                          :dupPlant?<><RefreshCw className="w-4 h-4"/> Update Plant</>
                          :<><Plus className="w-4 h-4"/> Save to Account</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
