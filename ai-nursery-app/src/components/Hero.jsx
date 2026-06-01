import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-100 to-green-50 min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-green-900">
            AI Powered <br />
            Plant Care & Nursery Store
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
            Buy plants, get AI recommendations, manage your garden,
            and chat with an intelligent plant assistant.
          </p>

          <div className="mt-10 flex gap-5">
            <button className="px-8 py-4 bg-green-700 text-white rounded-2xl text-lg hover:bg-green-800 transition shadow-lg">
              Explore Plants
            </button>

            <button className="px-8 py-4 border-2 border-green-700 text-green-700 rounded-2xl text-lg hover:bg-green-100 transition">
              AI Assistant
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop"
            alt="Plant"
            className="w-full max-w-xl h-[600px] object-cover rounded-[40px] shadow-2xl"
          />
        </motion.div>

      </div>
    </section>
  );
}