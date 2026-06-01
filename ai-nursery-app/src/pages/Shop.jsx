import {
  useState,
} from "react";

import PageWrapper from "../components/PageWrapper";

import Navbar from "../components/Navbar";

import PlantCard from "../components/PlantCard";

import plants from "../data/plants";

export default function Shop() {

  const [search,
    setSearch] =
    useState("");

  const [selectedCategory,
    setSelectedCategory] =
    useState("All");

  const categories = ["All", "Indoor", "Outdoor", "Flowering", "Medicinal", "Succulent", "Decorative", "Herb"];

  const filteredPlants =
    plants.filter((plant) => {

      const matchesSearch =

        plant.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =

        selectedCategory ===
          "All" ||

        plant.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (

    <PageWrapper>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">

        <Navbar />

        <div className="p-8 lg:p-16">

          {/* HERO */}
          <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-10 text-white shadow-2xl">

            <h1 className="text-5xl font-bold">
              Explore Plants 🌿
            </h1>

            <p className="text-xl text-green-100 mt-5 max-w-2xl leading-relaxed">

              Discover premium indoor,
              medicinal, decorative, and
              outdoor plants curated for
              modern living spaces.

            </p>

          </div>

          {/* SEARCH */}
          <div className="mt-10">

            <input
              type="text"
              placeholder="Search plants..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full md:w-[450px] px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-600 shadow-lg text-lg"
            />

          </div>

          {/* CATEGORY FILTERS */}
          <div className="flex flex-wrap gap-4 mt-8">

            {categories.map(
              (category) => (

                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  className={`px-6 py-3 rounded-2xl font-semibold transition duration-300 shadow-sm ${
                    selectedCategory ===
                    category

                      ? "bg-green-700 text-white shadow-xl scale-105"

                      : "bg-white text-green-700 border border-green-200 hover:bg-green-100"
                  }`}
                >
                  {category}
                </button>
              )
            )}

          </div>

          {/* RESULTS COUNT */}
          <div className="mt-8 text-lg text-gray-600">

            Showing
            {" "}
            <span className="font-bold text-green-700">
              {filteredPlants.length}
            </span>
            {" "}
            plants

          </div>

          {/* PLANTS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">

            {filteredPlants.length > 0 ? (

              filteredPlants.map(
                (plant) => (

                  <PlantCard
                    key={plant.id}
                    plant={plant}
                  />
                )
              )

            ) : (

              <div className="text-2xl text-gray-500 mt-10">

                No plants found 🌱

              </div>
            )}

          </div>

        </div>

      </div>

    </PageWrapper>
  );
}