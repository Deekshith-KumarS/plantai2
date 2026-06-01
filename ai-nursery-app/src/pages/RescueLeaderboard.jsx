import { useState, useEffect } from "react";
import { API_URL } from "../config";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { Trophy, Medal, Award, Loader2, Leaf, Star } from "lucide-react";

export default function RescueLeaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rescue/leaderboard`);
        if (res.ok) setLeaders(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shadow-sm border border-yellow-200"><Trophy className="w-5 h-5"/></div>;
    if (index === 1) return <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-sm border border-gray-300"><Medal className="w-5 h-5"/></div>;
    if (index === 2) return <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 shadow-sm border border-orange-200"><Medal className="w-5 h-5"/></div>;
    return <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-bold">{index + 1}</div>;
  };

  const getTitle = (rescues) => {
    if (rescues >= 10) return { title: "Eco Warrior", color: "text-green-700 bg-green-100" };
    if (rescues >= 5) return { title: "Green Guardian", color: "text-teal-700 bg-teal-100" };
    return { title: "Sprout Saver", color: "text-lime-700 bg-lime-100" };
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Plant Rescue Leaderboard</h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">Meet the top contributors in our community who are making a real difference by saving and exchanging plants.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-green-500" /></div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-900 px-8 py-5 flex items-center justify-between text-white">
                <h3 className="font-bold flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Hall of Fame</h3>
                <p className="text-sm text-gray-400 font-medium">Top {leaders.length} Rescuers</p>
              </div>

              <div className="divide-y divide-gray-50">
                {leaders.map((user, index) => {
                  const badge = getTitle(user.totalRescues);
                  return (
                    <div key={user._id} className="flex items-center p-6 hover:bg-gray-50 transition">
                      <div className="shrink-0 mr-6">
                        {getRankBadge(index)}
                      </div>
                      
                      <div className="flex-1 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 p-[2px]">
                          <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center font-bold text-xl text-green-700">
                            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-lg text-gray-900">{user.name}</h4>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.color} mt-1`}>
                            {badge.title}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-black text-green-600">{user.totalRescues}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rescues</p>
                      </div>
                    </div>
                  );
                })}

                {leaders.length === 0 && (
                  <div className="p-10 text-center text-gray-500 font-medium">
                    No rescues recorded yet. Be the first to make it on the leaderboard!
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}
