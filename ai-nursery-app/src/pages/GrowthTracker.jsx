import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function GrowthTracker() {

  const [plantName, setPlantName] =
    useState("");

  const [height, setHeight] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [lastWatered,
    setLastWatered] =
    useState("");

  const [lastFertilized,
    setLastFertilized] =
    useState("");

  const [health,
    setHealth] =
    useState("Healthy");

  const [records,
    setRecords] =
    useState([]);

  useEffect(() => {

    const savedRecords =

      JSON.parse(
        localStorage.getItem(
          "growthRecords"
        )
      ) || [];

    setRecords(
      savedRecords
    );

  }, []);

  const addRecord = () => {

    if (
      !plantName ||
      !height
    ) {

      alert(
        "Please enter plant name and height"
      );

      return;
    }

    const healthScore =

      health === "Healthy"

        ? 95

        : health ===
          "Needs Attention"

        ? 70

        : 40;

    let growthStage = "";

    if (height < 15)

      growthStage =
        "Seedling 🌱";

    else if (
      height < 50
    )

      growthStage =
        "Young Plant 🌿";

    else

      growthStage =
        "Mature Plant 🌳";

    const newRecord = {

      id: Date.now(),

      plantName,

      height,

      notes,

      health,

      healthScore,

      growthStage,

      lastWatered,

      lastFertilized,

      date:
        new Date().toLocaleDateString(),
    };

    const updatedRecords = [

      ...records,

      newRecord,
    ];

    setRecords(
      updatedRecords
    );

    localStorage.setItem(

      "growthRecords",

      JSON.stringify(
        updatedRecords
      )
    );

    setPlantName("");
    setHeight("");
    setNotes("");
    setLastWatered("");
    setLastFertilized("");
    setHealth(
      "Healthy"
    );
  };

  const deleteRecord =
    (id) => {

      const updatedRecords =

        records.filter(
          (
            record
          ) =>
            record.id !== id
        );

      setRecords(
        updatedRecords
      );

      localStorage.setItem(

        "growthRecords",

        JSON.stringify(
          updatedRecords
        )
      );
    };

  return (

    <div className="min-h-screen bg-stone-100">

      <Navbar />

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white px-10 py-14 rounded-b-[40px] shadow-md">

        <h1 className="text-5xl font-extrabold">

          Smart Plant Health Monitor 📈

        </h1>

        <p className="mt-4 text-xl text-emerald-100">

          Monitor growth, health and care history.

        </p>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-md border border-stone-200 p-8">

          <h2 className="text-3xl font-bold text-slate-800 mb-6">

            Add Plant Record

          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Plant Name"
              value={plantName}
              onChange={(e) =>
                setPlantName(
                  e.target.value
                )
              }
              className="px-5 py-4 rounded-2xl border border-stone-300"
            />

            <input
              type="number"
              placeholder="Height (cm)"
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

            <input
              type="date"
              value={lastWatered}
              onChange={(e) =>
                setLastWatered(
                  e.target.value
                )
              }
              className="px-5 py-4 rounded-2xl border border-stone-300"
            />

            <input
              type="date"
              value={lastFertilized}
              onChange={(e) =>
                setLastFertilized(
                  e.target.value
                )
              }
              className="px-5 py-4 rounded-2xl border border-stone-300"
            />

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
            onClick={
              addRecord
            }
            className="mt-6 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl font-semibold"
          >

            Save Record

          </button>

        </div>

        {/* RECORDS */}
        <div className="space-y-8 mt-8">

          {records.length ===
          0 ? (

            <div className="bg-white rounded-3xl shadow-md border border-stone-200 p-10 text-center text-slate-500">

              No plant records found.

            </div>

          ) : (

            records.map(
              (
                record
              ) => (

                <div
                  key={
                    record.id
                  }
                  className="bg-white rounded-3xl shadow-md border border-stone-200 p-8"
                >

                  <div className="flex justify-between items-center">

                    <h2 className="text-3xl font-bold text-slate-800">

                      {
                        record.plantName
                      }

                    </h2>

                    <button
                      onClick={() =>
                        deleteRecord(
                          record.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                    >

                      Delete

                    </button>

                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-8">

                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">

                      <p>
                        Height:
                        {" "}
                        <strong>
                          {
                            record.height
                          }
                          cm
                        </strong>
                      </p>

                      <p className="mt-2">
                        Stage:
                        {" "}
                        <strong>
                          {
                            record.growthStage
                          }
                        </strong>
                      </p>

                    </div>

                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">

                      <p>
                        Health:
                        {" "}
                        <strong>
                          {
                            record.health
                          }
                        </strong>
                      </p>

                      <p className="mt-2">
                        Last Watered:
                        {" "}
                        {
                          record.lastWatered
                        }
                      </p>

                      <p className="mt-2">
                        Last Fertilized:
                        {" "}
                        {
                          record.lastFertilized
                        }
                      </p>

                    </div>

                  </div>

                  {/* HEALTH SCORE */}

                  <div className="mt-8">

                    <h3 className="font-bold text-xl text-slate-800">

                      Plant Health Score

                    </h3>

                    <div className="w-full bg-stone-200 rounded-full h-5 mt-4">

                      <div
                        className="bg-emerald-600 h-5 rounded-full"
                        style={{
                          width:
                            `${record.healthScore}%`,
                        }}
                      />

                    </div>

                    <p className="mt-3 font-semibold text-emerald-700">

                      {
                        record.healthScore
                      }
                      %

                    </p>

                  </div>

                  {record.notes && (

                    <div className="mt-6 bg-stone-50 border border-stone-200 rounded-2xl p-5">

                      <h4 className="font-bold">

                        Notes

                      </h4>

                      <p className="mt-2 text-slate-600">

                        {
                          record.notes
                        }

                      </p>

                    </div>

                  )}

                </div>
              )
            )
          )}

        </div>

      </div>

    </div>
  );
}