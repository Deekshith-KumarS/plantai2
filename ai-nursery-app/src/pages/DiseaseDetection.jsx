import {
  useState,
} from "react";

import PageWrapper from "../components/PageWrapper";

import Navbar from "../components/Navbar";

import BackButton from "../components/BackButton";

export default function DiseaseDetection() {

  const [image,
    setImage] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const [result,
    setResult] =
    useState(null);

  const handleImage =
    (e) => {

      const file =
        e.target.files[0];

      if (file) {

        setImage(
          URL.createObjectURL(
            file
          )
        );

        setLoading(true);

        setResult(null);

        // SIMULATED AI ANALYSIS
        setTimeout(() => {

          const diseases = [

            {
              disease:
                "Leaf Spot",

              confidence:
                "94%",

              treatment:
                "Use neem oil spray and avoid excessive watering.",

              status:
                "Moderate",
            },

            {
              disease:
                "Powdery Mildew",

              confidence:
                "91%",

              treatment:
                "Improve air circulation and apply fungicide.",

              status:
                "High",
            },

            {
              disease:
                "Root Rot",

              confidence:
                "89%",

              treatment:
                "Reduce watering and improve soil drainage.",

              status:
                "Critical",
            },

            {
              disease:
                "Healthy Plant",

              confidence:
                "98%",

              treatment:
                "No disease detected. Plant is healthy.",

              status:
                "Healthy",
            },
          ];

          const randomDisease =
            diseases[
              Math.floor(
                Math.random() *
                  diseases.length
              )
            ];

          setResult(
            randomDisease
          );

          setLoading(false);

        }, 2500);
      }
    };

  return (

    <PageWrapper>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">

        <Navbar />

        <div className="p-8 lg:p-16 max-w-7xl mx-auto">

          <BackButton />

          {/* HERO */}
          <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-10 text-white shadow-2xl mt-6">

            <h1 className="text-5xl font-bold">
              AI Disease Detection 🌿
            </h1>

            <p className="text-xl text-green-100 mt-5 leading-relaxed max-w-3xl">

              Upload a plant image and let
              PlantAI analyze diseases,
              detect health issues, and
              recommend treatment instantly.

            </p>

          </div>

          {/* UPLOAD SECTION */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 mt-12">

            <h2 className="text-4xl font-bold text-green-700">
              Upload Plant Image
            </h2>

            <p className="text-gray-500 text-lg mt-4">
              Supported formats: JPG, PNG
            </p>

            <div className="mt-8">

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="text-lg"
              />

            </div>

            {image && (

              <div className="mt-10">

                <img
                  src={image}
                  alt="Plant"
                  className="w-full max-w-3xl rounded-3xl shadow-2xl border"
                />

              </div>
            )}

          </div>

          {/* LOADING */}
          {loading && (

            <div className="bg-white rounded-3xl shadow-2xl p-16 mt-12 text-center">

              <div className="animate-pulse text-7xl">
                🌿
              </div>

              <h2 className="text-4xl font-bold text-green-700 mt-8">
                AI Analyzing Plant...
              </h2>

              <p className="text-gray-500 text-lg mt-5">
                Detecting diseases and health issues.
              </p>

            </div>
          )}

          {/* RESULT */}
          {result && (

            <div className="bg-white rounded-3xl shadow-2xl p-10 mt-12">

              <h2 className="text-4xl font-bold text-green-700">
                Detection Result
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">

                {/* DISEASE */}
                <div className="bg-green-100 rounded-2xl p-6">

                  <h3 className="text-2xl font-bold text-green-700">
                    Disease
                  </h3>

                  <p className="mt-4 text-lg text-gray-700">
                    {result.disease}
                  </p>

                </div>

                {/* CONFIDENCE */}
                <div className="bg-green-100 rounded-2xl p-6">

                  <h3 className="text-2xl font-bold text-green-700">
                    Confidence
                  </h3>

                  <p className="mt-4 text-lg text-gray-700">
                    {result.confidence}
                  </p>

                </div>

                {/* STATUS */}
                <div className="bg-green-100 rounded-2xl p-6">

                  <h3 className="text-2xl font-bold text-green-700">
                    Status
                  </h3>

                  <p className="mt-4 text-lg text-gray-700">
                    {result.status}
                  </p>

                </div>

                {/* TREATMENT */}
                <div className="bg-green-100 rounded-2xl p-6">

                  <h3 className="text-2xl font-bold text-green-700">
                    Treatment
                  </h3>

                  <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                    {result.treatment}
                  </p>

                </div>

              </div>

              {/* AI RECOMMENDATION */}
              <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-8 text-white mt-12 shadow-xl">

                <h3 className="text-3xl font-bold">
                  AI Recommendation 🤖
                </h3>

                <p className="mt-5 text-lg text-green-100 leading-relaxed">

                  Based on the analysis,
                  monitor plant moisture
                  levels regularly and ensure
                  proper sunlight exposure
                  for healthier growth.

                </p>

              </div>

            </div>
          )}

        </div>

      </div>

    </PageWrapper>
  );
}