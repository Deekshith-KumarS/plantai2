import {
  useParams,
} from "react-router-dom";

import {
  useContext,
  useEffect,
} from "react";

import PageWrapper from "../components/PageWrapper";

import Navbar from "../components/Navbar";

import BackButton from "../components/BackButton";

import plants from "../data/plants";

import {
  CartContext,
} from "../context/CartContext";

import {
  WishlistContext,
} from "../context/WishlistContext";

import {
  RecentContext,
} from "../context/RecentContext";

export default function PlantDetails() {

  const { id } =
    useParams();

  const plant =
    plants.find(
      (p) =>
        p.id === Number(id)
    );

  const { addToCart } =
    useContext(CartContext);

  const { addToWishlist } =
    useContext(WishlistContext);

  const { addRecentPlant } =
    useContext(RecentContext);

  useEffect(() => {

    if (plant) {

      addRecentPlant(
        plant
      );
    }

  }, []);

  if (!plant) {

    return (
      <h1 className="text-5xl font-bold text-center mt-20 text-red-500">
        Plant not found
      </h1>
    );
  }

  return (

    <PageWrapper>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">

        <Navbar />

        <div className="p-8 lg:p-16">

          <BackButton />

          {/* MAIN CARD */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 grid lg:grid-cols-2 gap-10">

            {/* IMAGE */}
            <div className="relative">

              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover"
                onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=500"; }}
              />

              <div className="absolute top-6 left-6 bg-green-700 text-white px-5 py-3 rounded-full shadow-xl font-semibold">
                {plant.category}
              </div>

            </div>

            {/* DETAILS */}
            <div className="p-10">

              <h1 className="text-5xl font-bold text-green-700 leading-tight">
                {plant.name}
              </h1>

              <div className="flex items-center gap-4 mt-5">

                <div className="text-yellow-500 text-2xl">
                  ⭐⭐⭐⭐⭐
                </div>

                <p className="text-gray-500 text-lg">
                  4.8 Ratings
                </p>

              </div>

              <p className="text-5xl font-bold text-green-700 mt-8">
                ₹{plant.price}
              </p>

              <p className="mt-8 text-lg text-gray-600 leading-relaxed">
                {plant.description}
              </p>

              {/* CARE INFO */}
              <div className="grid md:grid-cols-2 gap-6 mt-12">

                <div className="bg-green-100 rounded-2xl p-6">
                  <h3 className="font-bold text-green-700 text-xl">☀️ Sunlight</h3>
                  <p className="mt-3 text-gray-700">{plant.care?.sunlight || "Indirect Light"}</p>
                </div>

                <div className="bg-green-100 rounded-2xl p-6">
                  <h3 className="font-bold text-green-700 text-xl">💧 Watering</h3>
                  <p className="mt-3 text-gray-700">{plant.care?.watering || "Twice a week"}</p>
                </div>

                <div className="bg-green-100 rounded-2xl p-6">
                  <h3 className="font-bold text-green-700 text-xl">🌱 Care Level</h3>
                  <p className="mt-3 text-gray-700">{plant.care?.level || "Easy Maintenance"}</p>
                </div>

                <div className="bg-green-100 rounded-2xl p-6">
                  <h3 className="font-bold text-green-700 text-xl">🏡 Placement</h3>
                  <p className="mt-3 text-gray-700">{plant.care?.placement || "Indoor / Outdoor"}</p>
                </div>

              </div>

              {/* BUTTONS */}
              <div className="grid md:grid-cols-2 gap-5 mt-12">

                <button
                  onClick={() =>
                    addToCart(plant)
                  }
                  className="bg-green-700 text-white py-5 rounded-2xl hover:bg-green-800 transition duration-300 text-xl font-bold shadow-xl"
                >
                  Add To Cart 🛒
                </button>

                <button
                  onClick={() =>
                    addToWishlist(
                      plant
                    )
                  }
                  className="bg-pink-500 text-white py-5 rounded-2xl hover:bg-pink-600 transition duration-300 text-xl font-bold shadow-xl"
                >
                  ❤ Wishlist
                </button>

              </div>

            </div>

          </div>

          {/* REVIEWS */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 mt-14">

            <h2 className="text-4xl font-bold text-green-700">
              Customer Reviews ⭐
            </h2>

            <div className="grid gap-6 mt-10">

              {plant.reviews?.map(
                (review, index) => (

                  <div
                    key={index}
                    className="bg-gray-50 rounded-2xl p-6 border hover:shadow-lg transition duration-300"
                  >

                    <div className="flex items-center justify-between flex-wrap gap-4">

                      <h3 className="font-bold text-2xl text-gray-800">
                        {review.user}
                      </h3>

                      <div className="text-yellow-500 text-xl">
                        {"⭐".repeat(
                          review.rating
                        )}
                      </div>

                    </div>

                    <p className="text-gray-600 mt-5 text-lg leading-relaxed">
                      {review.comment}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </PageWrapper>
  );
}