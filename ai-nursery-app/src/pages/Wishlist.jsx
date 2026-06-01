import {
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import PageWrapper from "../components/PageWrapper";

import Navbar from "../components/Navbar";

import BackButton from "../components/BackButton";

import {
  WishlistContext,
} from "../context/WishlistContext";

import {
  CartContext,
} from "../context/CartContext";

export default function Wishlist() {

  const navigate =
    useNavigate();

  const {
    wishlist,
    removeFromWishlist,
  } = useContext(WishlistContext);

  const { addToCart } =
    useContext(CartContext);

  return (

    <PageWrapper>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">

        <Navbar />

        <div className="p-8 lg:p-16">

          <BackButton />

          {/* HERO */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-10 text-white shadow-2xl mt-6">

            <h1 className="text-5xl font-bold">
              Wishlist ❤
            </h1>

            <p className="mt-5 text-xl text-pink-100 leading-relaxed max-w-2xl">
              Save and organize your
              favorite plants for future
              purchases and inspiration.
            </p>

          </div>

          {/* EMPTY STATE */}
          {wishlist.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-2xl p-16 mt-12 text-center">

              <div className="text-8xl">
                💖
              </div>

              <h2 className="text-4xl font-bold text-gray-700 mt-8">
                Your wishlist is empty
              </h2>

              <p className="text-gray-500 mt-4 text-lg">
                Browse plants and save your favorites.
              </p>

              <button
                onClick={() =>
                  navigate("/shop")
                }
                className="mt-8 bg-pink-500 text-white px-10 py-4 rounded-2xl hover:bg-pink-600 transition duration-300 text-lg font-semibold shadow-xl"
              >
                Explore Plants
              </button>

            </div>

          ) : (

            <>
              {/* COUNT */}
              <div className="mt-10 text-lg text-gray-600">

                You have
                {" "}
                <span className="font-bold text-pink-600">
                  {wishlist.length}
                </span>
                {" "}
                favorite plants

              </div>

              {/* GRID */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">

                {wishlist.map(
                  (plant) => (

                    <div
                      key={plant.id}
                      className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transition duration-300"
                    >

                      {/* IMAGE */}
                      <div className="relative">

                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="h-72 w-full object-cover"
                        />

                        <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                          ❤ Favorite
                        </div>

                      </div>

                      {/* CONTENT */}
                      <div className="p-7">

                        <h2 className="text-3xl font-bold text-pink-600">
                          {plant.name}
                        </h2>

                        <p className="text-gray-500 mt-3 text-lg">
                          {plant.category}
                        </p>

                        <p className="text-gray-600 mt-5 leading-relaxed">
                          {plant.description}
                        </p>

                        <div className="flex items-center justify-between mt-7">

                          <h3 className="text-3xl font-bold text-green-700">
                            ₹{plant.price}
                          </h3>

                          <div className="text-yellow-500 text-lg">
                            {plant.reviews && plant.reviews.length > 0
                              ? `⭐ ${(
                                  plant.reviews.reduce((sum, r) => sum + r.rating, 0) /
                                  plant.reviews.length
                                ).toFixed(1)}`
                              : "No reviews yet"}
                          </div>

                        </div>

                        {/* BUTTONS */}
                        <div className="grid gap-4 mt-8">

                          <button
                            onClick={() =>
                              addToCart(
                                plant
                              )
                            }
                            className="bg-green-700 text-white py-4 rounded-2xl hover:bg-green-800 transition duration-300 text-lg font-semibold shadow-lg"
                          >
                            Add To Cart
                          </button>

                          <button
                            onClick={() =>
                              navigate(
                                `/plant/${plant.id}`
                              )
                            }
                            className="bg-white border-2 border-pink-500 text-pink-500 py-4 rounded-2xl hover:bg-pink-50 transition duration-300 text-lg font-semibold"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() =>
                              removeFromWishlist(
                                plant.id
                              )
                            }
                            className="bg-red-500 text-white py-4 rounded-2xl hover:bg-red-600 transition duration-300 text-lg font-semibold shadow-lg"
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            </>
          )}

        </div>

      </div>

    </PageWrapper>
  );
}