"use client";

import maplibregl from "maplibre-gl";
import Head from "next/head";
import { useState, useEffect } from "react";

import { buildDayColumnString } from "@/utils/date";
import { fetchConfessionsForToday } from "@/utils/supabase";

type ProcessedConfessionData = {
  parish: string | null;
  church: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  longitude: number | null;
  latitude: number | null;
  scheduleForToday: string | null;
} | null;

function replaceSpacesWithPlus(church: string, address: string): string {
  const combinedAddress = church + " Church " + address;
  return combinedAddress.replace(/ /g, "+");
}

const ConfessionFinder = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedChurch, setSelectedChurch] =
    useState<ProcessedConfessionData | undefined>(null);
  const [confessionData, setConfessionData] = useState<
    ProcessedConfessionData[] | undefined
  >(undefined);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showModal && !(e.target as Element).closest(".modal")) {
        setShowModal(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    let map: maplibregl.Map;

    if (showModal && selectedChurch) {
      map = new maplibregl.Map({
        container: "map", // container id
        style:
          "https://api.maptiler.com/maps/openstreetmap/style.json?key=Gg9G27Gs6exqgEIvMBgx",
        center: [
          selectedChurch?.longitude ?? 144.946457,
          selectedChurch?.latitude ?? -37.840935,
        ], // starting position [lng, lat]
        zoom: 10, // starting zoom
      });

      // Wait for the map to load before adding the marker
      map.on("load", () => {
        new maplibregl.Marker()
          .setLngLat([
            selectedChurch?.longitude ?? 144.946457,
            selectedChurch?.latitude ?? -37.840935,
          ])
          .addTo(map);

        map.flyTo({
          center: [
            selectedChurch?.longitude ?? 144.946457,
            selectedChurch?.latitude ?? -37.840935,
          ],
          zoom: 15,
          duration: 1500,
        });
      });
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      map?.remove();
    };
  }, [showModal]);

  useEffect(() => {
    fetchConfessionsForToday().then((data) => {
      const currentDayColumnString = buildDayColumnString(new Date());
      const processedData: ProcessedConfessionData[] | undefined = data?.map((record) => ({
          parish: record.parish,
          church: record.church,
          address: record.address,
          phone: record.phone,
          email: record.email,
          website: record.website,
          longitude: record.longitude,
          latitude: record.latitude,
          scheduleForToday: record[currentDayColumnString],
      }));
      setConfessionData(processedData);
    });
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://unpkg.com/maplibre-gl@^5.6.0/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen">
        <section className="py-20 text-center">
          <div className="container mx-auto px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 mb-6 font-display tracking-tighter">
              Confession Finder
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-6">
              Find nearby Catholic churches in Melbourne offering confession on
              the day nearest to your location. This tool helps you locate the
              closest church with available confession times.
            </p>
          </div>
          <div>
            <div className="relative w-full mx-auto container p-8">
              <input
                type="text"
                className="w-full pr-10 py-2 pl-4 border-2 border-yellow-600 rounded p-2 text-gray-600 focus:outline-2 focus:outline-yellow-500"
                placeholder="Type in your current location..."
              />
              <img
                src="/search.svg"
                className="absolute right-11 top-11 h-5 w-5 text-gray-500"
              />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 2xl:max-w-[1472px] xl:max-w-[1216px] lg:max-w-[960px] md:max-w-[704px] max-w-[576px] sm:mx-auto mx-8">
              {confessionData
                ? confessionData.map((record, index) => (
                    <div
                      className="text-black bg-container-background-color rounded-lg shadow-md p-4 w-full flex justify-between items-center text-sm cursor-pointer gap-4 hover:bg-container-background-color-dark transition-colors"
                      onClick={() => {
                        setSelectedChurch(record);
                        setShowModal(true);
                      }}
                      key={`confession-data-${index}`}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="font-bold">{record?.church}</span>
                        <span className="font-medium text-gray-500">
                          {record?.parish}
                        </span>
                      </div>
                      <span className="font-bold">
                        {record?.scheduleForToday ? (
                          `Today, ${record.scheduleForToday}`
                        ) : (
                          <span className="text-xs">
                            No schedule today.
                            <br />
                            Call{" "}
                            <a
                              href={`tel:${record?.phone}`}
                              target="_blank"
                              className="underline hover:text-gray-500 transition-all duration-300"
                            >
                              {record?.phone}
                            </a>{" "}
                            to schedule.
                            {record?.website ? (
                              <>
                                <br />
                                Check the{" "}
                                <a
                                  href={record.website}
                                  target="_blank"
                                  className="underline hover:text-gray-500 transition-all duration-300"
                                >
                                  website
                                </a>{" "}
                                for office hours.
                              </>
                            ) : (
                              ""
                            )}
                          </span>
                        )}
                      </span>
                      <img src="/arrow-right.svg" width={20} />
                    </div>
                  ))
                : null}
            </div>
          </div>
        </section>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-blur-sm backdrop-blur-xs flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="modal rounded-lg shadow-lg max-w-lg w-full p-6 bg-container-background-color-dark">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedChurch?.church}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-300 cursor-pointer transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="currentColor"
                    d="m3.219 2.154l6.778 6.773l6.706-6.705c.457-.407.93-.164 1.119.04a.777.777 0 0 1-.044 1.035l-6.707 6.704l6.707 6.702c.298.25.298.74.059 1.014c-.24.273-.68.431-1.095.107l-6.745-6.749l-6.753 6.752c-.296.265-.784.211-1.025-.052c-.242-.264-.334-.72-.025-1.042l6.729-6.732l-6.701-6.704c-.245-.27-.33-.764 0-1.075c.33-.311.822-.268.997-.068Z"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <p>
                <strong>Address:</strong> {selectedChurch?.address}
              </p>
              <p>
                <strong>Phone: </strong>
                <a
                  href={`tel:${selectedChurch?.phone}`}
                  target="_blank"
                  className="text-yellow-200 underline hover:text-yellow-300 transition-all"
                >
                  {selectedChurch?.phone}
                </a>
              </p>
              <p>
                <strong>Email: </strong>
                <a
                  href={`mailto:${selectedChurch?.email}`}
                  target="_blank"
                  className="text-yellow-200 underline hover:text-yellow-300 transition-all"
                >
                  {selectedChurch?.email}
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={selectedChurch?.website ?? ""}
                  target="_blank"
                  className="text-yellow-200 underline hover:text-yellow-300 transition-all"
                >
                  {selectedChurch?.website}
                </a>
              </p>
              <p>
                <strong>Confession Schedule:</strong>
                <br />
                {selectedChurch?.scheduleForToday}
              </p>
              <p>
                <a
                  href={`https://www.google.com/maps/search/${replaceSpacesWithPlus(selectedChurch?.church ?? "", selectedChurch?.address ?? "")}`}
                  target="_blank"
                  className="text-yellow-200 underline hover:text-yellow-300 transition-all"
                >
                  Directions
                </a>
              </p>
              <div id="map" className="w-full h-[240px]"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfessionFinder;
