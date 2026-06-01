import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";

export default function PlantHealthDashboard() {

  const plantDatabase = {

  "Snake Plant": {
    matureHeight: 80,
    wateringDays: 7,
    fertilizerDays: 30,
    sunlight: "Indirect Light",
  },

  "Aloe Vera": {
    matureHeight: 60,
    wateringDays: 10,
    fertilizerDays: 45,
    sunlight: "Bright Light",
  },

  "Money Plant": {
    matureHeight: 120,
    wateringDays: 5,
    fertilizerDays: 30,
    sunlight: "Partial Light",
  },

  "Rose Plant": {
    matureHeight: 100,
    wateringDays: 3,
    fertilizerDays: 20,
    sunlight: "Full Sunlight",
  },

  "Peace Lily": {
    matureHeight: 90,
    wateringDays: 6,
    fertilizerDays: 30,
    sunlight: "Indirect Light",
  },

  "Cactus": {
    matureHeight: 50,
    wateringDays: 14,
    fertilizerDays: 60,
    sunlight: "Bright Light",
  },

  "Jade Plant": {
    matureHeight: 70,
    wateringDays: 10,
    fertilizerDays: 45,
    sunlight: "Bright Light",
  },

  "Spider Plant": {
    matureHeight: 60,
    wateringDays: 5,
    fertilizerDays: 30,
    sunlight: "Indirect Light",
  },

  "Areca Palm": {
    matureHeight: 180,
    wateringDays: 4,
    fertilizerDays: 30,
    sunlight: "Bright Light",
  },

  "Rubber Plant": {
    matureHeight: 150,
    wateringDays: 6,
    fertilizerDays: 30,
    sunlight: "Indirect Light",
  },

  "Tulsi": {
    matureHeight: 90,
    wateringDays: 2,
    fertilizerDays: 20,
    sunlight: "Full Sunlight",
  },

  "Lavender": {
    matureHeight: 80,
    wateringDays: 5,
    fertilizerDays: 30,
    sunlight: "Full Sunlight",
  },

  "Hibiscus": {
    matureHeight: 150,
    wateringDays: 3,
    fertilizerDays: 20,
    sunlight: "Full Sunlight",
  },

  "Orchid": {
    matureHeight: 50,
    wateringDays: 7,
    fertilizerDays: 30,
    sunlight: "Indirect Light",
  },

  "Bamboo Plant": {
    matureHeight: 120,
    wateringDays: 7,
    fertilizerDays: 45,
    sunlight: "Partial Light",
  },

  "ZZ Plant": {
    matureHeight: 90,
    wateringDays: 10,
    fertilizerDays: 45,
    sunlight: "Low Light",
  },

  "Pothos": {
    matureHeight: 150,
    wateringDays: 5,
    fertilizerDays: 30,
    sunlight: "Indirect Light",
  },

  "Monstera": {
    matureHeight: 200,
    wateringDays: 5,
    fertilizerDays: 30,
    sunlight: "Bright Indirect Light",
  },

  "Bird of Paradise": {
    matureHeight: 250,
    wateringDays: 4,
    fertilizerDays: 20,
    sunlight: "Full Sunlight",
  },

  "Fiddle Leaf Fig": {
    matureHeight: 180,
    wateringDays: 6,
    fertilizerDays: 30,
    sunlight: "Bright Light",
  },

};

  const [records, setRecords] = useState([]);
  const [plantName, setPlantName] = useState("Snake Plant");
  const [height, setHeight] = useState("");
  const [health, setHealth] = useState("Healthy");
  const [lastWatered, setLastWatered] = useState("");
  const [lastFertilized, setLastFertilized] = useState("");
  const [notes, setNotes] = useState("");
const [loading, setLoading] =
  useState(false);
  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "plantHealthRecords"
        )
      ) || [];

    setRecords(saved);

  }, []);

  const calculateHealthScore = () => {

    if (health === "Healthy")
      return 95;

    if (health === "Needs Attention")
      return 70;

    return 40;
  };

  const calculateRiskLevel = (score) => {

    if (score > 85)
      return "Low Risk";

    if (score > 60)
      return "Medium Risk";

    return "High Risk";
  };

  const calculateGrowthStage = (
    currentHeight,
    matureHeight
  ) => {

    const percentage =
      (currentHeight /
        matureHeight) *
      100;

    if (percentage < 25)
      return "Seedling 🌱";

    if (percentage < 50)
      return "Young Plant 🌿";

    if (percentage < 90)
      return "Mature Plant 🌳";

    return "Fully Grown 🏆";
  };

  const calculateProgress = (
    currentHeight,
    matureHeight
  ) =>

    Math.min(
      Math.round(
        (currentHeight /
          matureHeight) *
          100
      ),
      100
    );

  const calculateReminder = (
    dateString,
    interval
  ) => {

    if (!dateString)
      return "Not Set";

    const today =
      new Date();

    const selectedDate =
      new Date(dateString);

    const diffDays =
      Math.floor(
        (today -
          selectedDate) /
          (
            1000 *
            60 *
            60 *
            24
          )
      );

    const remaining =
      interval -
      diffDays;

    if (remaining <= 0)
      return "Due Today";

    return `${remaining} Days Remaining`;
  };

  const generateCalendar = () => [

    {
      day: "Monday",
      task: "Water Plant",
    },

    {
      day: "Wednesday",
      task: "Check Leaves",
    },

    {
      day: "Friday",
      task: "Fertilizer",
    },

    {
      day: "Sunday",
      task: "Health Inspection",
    },

  ];

  const addRecord = () => {
setLoading(true);
    if (!height) {

      alert(
        "Enter plant height"
      );

      return;
    }

    const plantData =
      plantDatabase[
        plantName
      ];

    const healthScore =
      calculateHealthScore();

    const riskLevel =
      calculateRiskLevel(
        healthScore
      );

    const progress =
      calculateProgress(
        Number(height),
        plantData.matureHeight
      );

    const growthStage =
      calculateGrowthStage(
        Number(height),
        plantData.matureHeight
      );

    const newRecord = {

      id: Date.now(),

      plantName,

      height:
        Number(height),

      health,

      healthScore,

      riskLevel,

      progress,

      growthStage,

      notes,

      sunlight:
        plantData.sunlight,

      wateringReminder:
        calculateReminder(
          lastWatered,
          plantData.wateringDays
        ),

      fertilizerReminder:
        calculateReminder(
          lastFertilized,
          plantData.fertilizerDays
        ),

      careCalendar:
        generateCalendar(),

      date:
        new Date().toLocaleDateString(),
    };

   setTimeout(() => {

  const updated = [

    ...records,

    newRecord,
  ];

  setRecords(
    updated
  );

  localStorage.setItem(

    "plantHealthRecords",

    JSON.stringify(
      updated
    )
  );

  setHeight("");
  setNotes("");

  setLoading(false);

}, 2500);
  };

  const chartData = records
    .filter(
      (record) =>
        record.plantName ===
        plantName
    )
    .map(
      (
        record,
        index
      ) => ({
        week:
          `Record ${index + 1}`,
        height:
          record.height,
      })
    );

  return (

    <div className="min-h-screen bg-stone-100">

      <Navbar />

      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white px-10 py-14 rounded-b-[40px] shadow-md">

        <h1 className="text-5xl font-extrabold">
         Smart Plant Monitor 🌱
        </h1>

        <p className="mt-4 text-xl text-emerald-100">
          AI Powered Plant Growth, Health Analysis & Care Management
        </p>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        <div className="bg-white rounded-3xl shadow-md border border-stone-200 p-8">

          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Add Plant Record
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <select
              value={plantName}
              onChange={(e) =>
                setPlantName(
                  e.target.value
                )
              }
              className="px-5 py-4 rounded-2xl border border-stone-300"
            >

              {Object.keys(
                plantDatabase
              ).map(
                (
                  plant
                ) => (
                  <option
                    key={plant}
                  >
                    {plant}
                  </option>
                )
              )}

            </select>

            <input
              type="number"
              placeholder="Current Height (cm)"
              value={height}
              onChange={(e) =>
                setHeight(
                  e.target.value
                )
              }
              className="px-5 py-4 rounded-2xl border border-stone-300"
            />

            <select
              value={health}
              onChange={(e) =>
                setHealth(
                  e.target.value
                )
              }
              className="px-5 py-4 rounded-2xl border border-stone-300"
            >

              <option>
                Healthy
              </option>

              <option>
                Needs Attention
              </option>

              <option>
                Critical
              </option>

            </select>
                    <div>

  <label className="block text-sm font-semibold text-slate-700 mb-2">

    Last Watered Date 💧

  </label>

  <input
    type="date"
    value={lastWatered}
    onChange={(e) =>
      setLastWatered(
        e.target.value
      )
    }
    className="w-full px-5 py-4 rounded-2xl border border-stone-300"
  />

  <p className="text-xs text-slate-500 mt-2">

    Select the most recent date you watered this plant.

  </p>

</div>  

            <div>

  <label className="block text-sm font-semibold text-slate-700 mb-2">

    Last Fertilized Date 🌿

  </label>

  <input
    type="date"
    value={lastFertilized}
    onChange={(e) =>
      setLastFertilized(
        e.target.value
      )
    }
    className="w-full px-5 py-4 rounded-2xl border border-stone-300"
  />

  <p className="text-xs text-slate-500 mt-2">

    Select the last date fertilizer was applied to this plant.

  </p>

</div>
            <input
              type="text"
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="px-5 py-4 rounded-2xl border border-stone-300"
            />

          </div>

          <button
  onClick={addRecord}
  disabled={loading}
  className={`mt-6 px-8 py-4 rounded-2xl font-semibold text-white ${
    loading
      ? "bg-gray-500"
      : "bg-emerald-700 hover:bg-emerald-800"
  }`}
>
  {loading
    ? "Analyzing Plant..."
    : "Analyze Plant"}
</button>
{loading && (

  <div className="mt-6">

    <div className="w-full bg-gray-200 rounded-full h-4">

      <div className="bg-emerald-600 h-4 rounded-full animate-pulse w-full"></div>

    </div>

    <p className="mt-3 text-emerald-700 font-semibold">

      AI is analyzing plant health,
      growth stage, risk level and
      care schedule...

    </p>

  </div>

)}

        </div>

        {records.length > 0 && (() => {

          const latest =
            records[
              records.length - 1
            ];

          return (

            <>

              <div className="grid md:grid-cols-4 gap-6 mt-8">

                <div className="bg-white p-6 rounded-3xl shadow-md">
                  <h3 className="text-slate-500">
                    Health Score
                  </h3>

                  <p className="text-4xl font-bold text-emerald-700 mt-3">
                    {latest.healthScore}%
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-md">
                  <h3 className="text-slate-500">
                    Risk Level
                  </h3>

                  <p className="text-3xl font-bold text-slate-800 mt-3">
                    {latest.riskLevel}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-md">
                  <h3 className="text-slate-500">
                    Growth Stage
                  </h3>

                  <p className="text-2xl font-bold text-slate-800 mt-3">
                    {latest.growthStage}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-md">
                  <h3 className="text-slate-500">
                    Growth Progress
                  </h3>

                  <p className="text-4xl font-bold text-emerald-700 mt-3">
                    {latest.progress}%
                  </p>
                </div>

              </div>

              <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

                <h2 className="text-2xl font-bold">
                  Live Growth Progress
                </h2>

                <div className="w-full bg-stone-200 rounded-full h-6 mt-6">

                  <div
                    className="bg-emerald-600 h-6 rounded-full"
                    style={{
                      width:
                        `${latest.progress}%`,
                    }}
                  />

                </div>

                <p className="mt-4 font-semibold">
                  {latest.progress}% Complete
                </p>

              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">

                <div className="bg-white rounded-3xl shadow-md p-6">

                  <h2 className="text-2xl font-bold">
                    💧 Water Reminder
                  </h2>

                  <p className="mt-4 text-xl">
                    {latest.wateringReminder}
                  </p>

                </div>

                <div className="bg-white rounded-3xl shadow-md p-6">

                  <h2 className="text-2xl font-bold">
                    🌿 Fertilizer Reminder
                  </h2>

                  <p className="mt-4 text-xl">
                    {latest.fertilizerReminder}
                  </p>

                </div>

              </div>

              <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

                <h2 className="text-3xl font-bold">
                  Weekly Care Calendar
                </h2>

                <div className="grid md:grid-cols-4 gap-4 mt-6">

                  {latest.careCalendar.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={index}
                        className="bg-stone-50 border border-stone-200 rounded-2xl p-5"
                      >

                        <h4 className="font-bold">
                          {item.day}
                        </h4>

                        <p className="mt-2">
                          {item.task}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

              <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

                <h2 className="text-3xl font-bold">
                  Growth Timeline
                </h2>

                <div className="flex justify-between mt-8 text-center">

                  <div className={`p-4 rounded-xl ${latest.growthStage.includes("Seedling") ? "bg-emerald-100 border-2 border-emerald-600" : ""}`}>
                    🌱
                    <p>Seedling</p>
                  </div>

                  <div className={`p-4 rounded-xl ${latest.growthStage.includes("Young") ? "bg-emerald-100 border-2 border-emerald-600" : ""}`}>
                    🌿
                    <p>Young</p>
                  </div>

                  <div className={`p-4 rounded-xl ${latest.growthStage.includes("Mature") ? "bg-emerald-100 border-2 border-emerald-600" : ""}`}>
                    🌳
                    <p>Mature</p>
                  </div>

                  <div className={`p-4 rounded-xl ${latest.growthStage.includes("Fully") ? "bg-emerald-100 border-2 border-emerald-600" : ""}`}>
                    🏆
                    <p>Fully Grown</p>
                  </div>

                </div>

              </div>

              <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

                <h2 className="text-3xl font-bold">
                  Growth Trend Chart 📈
                </h2>

                <div className="mt-8 space-y-6">

                  {chartData.length === 0 ? (

                    <div className="text-center text-slate-500 py-10">
                      No growth records available.
                    </div>

                  ) : (

                    chartData.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="bg-stone-50 rounded-2xl p-5 border"
                        >

                          <div className="flex justify-between mb-2">

                            <span className="font-semibold">
                              {item.week}
                            </span>

                            <span className="font-bold text-emerald-700">
                              {item.height} cm
                            </span>

                          </div>

                          <div className="w-full bg-stone-200 rounded-full h-6">

                            <div
                              className="bg-emerald-600 h-6 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  item.height * 3,
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

            </>

          );

        })()}

      </div>

    </div>

  );

}
//export default PlantHealthDashboard;