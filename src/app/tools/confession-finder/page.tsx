"use client";

import maplibregl from "maplibre-gl";
import Head from "next/head";
import { useState, useEffect } from "react";

import { buildDayColumnString } from "@/utils/date";
import { haversineDistance } from "@/utils/math";
import { formatTimeIfNoLetters, replaceSpacesWithPlus } from "@/utils/string";
import { fetchConfessionsForToday } from "@/utils/supabase";

import "@/css/maplibre-gl.css";

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

const ConfessionFinder = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationButtonClicked, setIsLocationButtonClicked] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<
    ProcessedConfessionData | undefined
  >(null);
  const [confessionData, setConfessionData] = useState<
    ProcessedConfessionData[] | undefined
  >(undefined);

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setLocationError("");
        setIsLocationButtonClicked(true);
      },
      (err) => {
        setLocationError(`Error getting location: ${err.message}`);
        setCurrentLocation(null);
        setIsLocationButtonClicked(false);
        setIsLoading(false);
      },
    );
  };

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
    if (isLocationButtonClicked && currentLocation) {
      console.log("isLocationButtonClicked", isLocationButtonClicked);
      console.log("currentLocation", currentLocation);
      fetchConfessionsForToday().then((data) => {
        const currentDayColumnString = buildDayColumnString(new Date());
        const processedData: ProcessedConfessionData[] | undefined = data?.map(
          (record) => ({
            parish: record.parish,
            church: record.church,
            address: record.address,
            phone: record.phone,
            email: record.email,
            website: record.website,
            longitude: record.longitude,
            latitude: record.latitude,
            scheduleForToday: formatTimeIfNoLetters(
              record[currentDayColumnString],
            ),
          }),
        );
        const sortedData = processedData?.sort((a, b) => {
          const distA = haversineDistance(
            a?.latitude,
            a?.longitude,
            currentLocation.lat,
            currentLocation.lng,
          );
          const distB = haversineDistance(
            b?.latitude,
            b?.longitude,
            currentLocation.lat,
            currentLocation.lng,
          );
          return distA - distB;
        });
        setConfessionData(sortedData?.slice(0, 10));
        setIsLoading(false);
      });
    }
  }, [isLocationButtonClicked, currentLocation]);

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
              <button
                onClick={handleLocation}
                className="w-full py-3 px-4 text-lg font-bold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition cursor-pointer bg-yellow-700 hover:bg-yellow-800 mb-2"
              >
                {isLoading ? (
                  <div className="text-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                      >
                        <path
                          strokeDasharray="60"
                          strokeDashoffset="60"
                          strokeOpacity=".3"
                          d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="stroke-dashoffset"
                            dur="1.3s"
                            values="60;0"
                          />
                        </path>
                        <path
                          strokeDasharray="15"
                          strokeDashoffset="15"
                          d="M12 3C16.9706 3 21 7.02944 21 12"
                        >
                          <animate
                            fill="freeze"
                            attributeName="stroke-dashoffset"
                            dur="0.3s"
                            values="15;0"
                          />
                          <animateTransform
                            attributeName="transform"
                            dur="1.5s"
                            repeatCount="indefinite"
                            type="rotate"
                            values="0 12 12;360 12 12"
                          />
                        </path>
                      </g>
                    </svg>
                  </div>
                ) : (
                  "Get my location & find confession"
                )}
              </button>
              <span className="text-xs text-gray-400">
                We do not store any of your location data.
              </span>
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
                      <div className="flex gap-4">
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
                <strong>Confession Schedule for Today:</strong>
                <br />
                {selectedChurch?.scheduleForToday ?? "No schedule."}
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
