"use client";

import { useState, useEffect } from "react";
// import StatusDisplay from "@/app/components/StatusDisplay";
// import ThemeToggle from "@/app/components/ThemeToggle";
import SingleNumberCheck from "@/app/components/SingleNumberCheck";
// import NinjaOTP from "./components/NinjaOTP";
import PowerSMS from "./components/PowerSMS";
import VOtpShop from "./components/VOtpShop";

export default function Home() {
  const [mode, setMode] = useState<"fetch" | "single">("fetch"); // using this state to toggle between modes

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div> */}
        <h1 className="text-3xl font-bold text-center mb-8 md:text-4xl lg:text-5xl">
          Swiggy Number Checker
        </h1>

        {/* these are the two toggle buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("fetch")}
            className={`px-4 py-2 rounded-lg ${mode === "fetch" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
          >
            Automatically Fetch
          </button>
          <button
            onClick={() => setMode("single")}
            className={`px-4 py-2 rounded-lg ${mode === "single" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
          >
            Check Single Number
          </button>
        </div>

        {/* rendering appropriate component form based on the mode */}
        {mode === "fetch" ? (
          <div className="space-y-4 py-4">
            {/* <NinjaOTP /> */}
            <div className="max-w mx-auto md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg px-4 py-2">
              <div className="flex justify-center items-center mb-2 text-xl tracking-tighter text-blue-500">
                NinjaOTP services are unavailable right now.
              </div>
              NinjaOTP implemented cloudflare in their api services (Dunno why!!), so the api calls are failing.
              Kindly wait until they undo this.
            </div>
            <VOtpShop />
            <PowerSMS />
          </div>) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <SingleNumberCheck />
          </div>
        )}
      </div>
    </div>
  );
}