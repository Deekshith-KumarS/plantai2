import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import plants from "../data/plants";

export default function ProductDetails() {
  const { id } = useParams();

  const plant = plants.find((p) => p.id === Number(id));

  if (!plant) {
    return <h1>Plant not found</h1>;
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <BackButton />

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
        <img
          src={plant.image}
          alt={plant.name}
          className="w-full h-[400px] object-cover"
        />

        <div className="p-8">
          <h1 className="text-5xl font-bold text-green-700 mb-4">
            {plant.name}
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            {plant.description}
          </p>

          <p className="text-3xl font-bold text-green-600 mb-6">
            ₹{plant.price}
          </p>

          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}