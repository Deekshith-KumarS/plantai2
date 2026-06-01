import {
  useNavigate,
} from "react-router-dom";

export default function PlantCard({
  plant,
}) {

  const navigate =
    useNavigate();

  return (

    <div
      onClick={() =>
        navigate(
          `/plant/${plant.id}`
        )
      }
      className="bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer"
    >

      <img
        src={plant.image}
        alt={plant.name}
        className="h-64 w-full object-cover"
        onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=500"; }}
      />

      <div className="p-6">

        <h2 className="text-2xl font-bold text-green-700">
          {plant.name}
        </h2>

        <p className="text-gray-500 mt-2">
          {plant.category}
        </p>

        <p className="text-2xl font-bold text-green-700 mt-4">
          ₹{plant.price}
        </p>

      </div>

    </div>
  );
}