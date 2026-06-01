import {
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  RecentContext,
} from "../context/RecentContext";

export default function RecentlyViewed() {

  const { recentPlants } =
    useContext(RecentContext);

  const navigate =
    useNavigate();

  if (
    recentPlants.length === 0
  ) {
    return null;
  }

  return (
    <div className="mt-16">

      <h2 className="text-4xl font-bold text-green-700">
        Recently Viewed 👀
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">

        {recentPlants.map(
          (plant) => (

            <div
              key={plant.id}
              onClick={() =>
                navigate(
                  `/plant/${plant.id}`
                )
              }
              className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:scale-105 transition"
            >

              <img
                src={plant.image}
                alt={plant.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">

                <h3 className="text-2xl font-bold text-green-700">
                  {plant.name}
                </h3>

                <p className="text-gray-500 mt-2">
                  ₹{plant.price}
                </p>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}