import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PlantCard from "../components/PlantCard";

import plants from "../data/plants";

export default function Home() {
  return (
    <div className="bg-green-50 min-h-screen">
      
      <Navbar />

      <Hero />

      <section className="px-8 lg:px-16 py-24">
        
        <div className="flex justify-between items-center mb-14">
          <h1 className="text-5xl font-bold text-green-900">
            Featured Plants
          </h1>

          <button className="bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition">
            View All
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>

      </section>
    </div>
  );
}