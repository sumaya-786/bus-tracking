import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bus } from "lucide-react";

const Home: React.FC = () => {
  const [startPoint, setStartPoint] = useState("Starting Point");
  const [destination, setDestination] = useState("Destination");
  const [error, setError] = useState(""); // ✅ Error state
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🚨 Validation checks
    if (startPoint === "Starting Point" || destination === "Destination") {
      setError("⚠ Please select both a starting point and a destination.");
      return;
    }

    if (startPoint === destination) {
      setError("⚠ Invalid: Starting point and destination cannot be the same.");
      return;
    }

    setError(""); // clear previous error
    console.log({ startPoint, destination });
    navigate("/active-buses");
  };

  const handleSignOut = () => {
    navigate("/");
  };

  // ⏳ Auto-hide error after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const stops = [
    { routeNo: 14, stopNo: 1, stopName: "Penamaluru Center" },
    { routeNo: 14, stopNo: 2, stopName: "Sitapuram Colony" },
    { routeNo: 14, stopNo: 3, stopName: "Poranki Center" },
    { routeNo: 14, stopNo: 4, stopName: "Capital Hospital" },
    { routeNo: 14, stopNo: 5, stopName: "Autonagar Gate" },
    { routeNo: 14, stopNo: 6, stopName: "NTR Circle" },
    { routeNo: 14, stopNo: 7, stopName: "Benz Circle" },
    { routeNo: 14, stopNo: 8, stopName: "VIT-AP" },
    { routeNo: 14, stopNo: 9, stopName: "Ganavaram" },
    { routeNo: 14, stopNo: 10, stopName: "Ayush Hospital" },
    { routeNo: 14, stopNo: 11, stopName: "Benz Circle (Second)" },
    { routeNo: 14, stopNo: 12, stopName: "VIT-AP (Second)" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* 🚨 Popup Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg shadow-lg font-medium text-center z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <motion.nav
        className="bg-red-600 shadow-md"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-white font-bold text-xl flex items-center gap-2">
              <Bus className="w-6 h-6" /> Bus Monitor / బస్ మానిటర్
            </h1>

            <motion.button
              onClick={handleSignOut}
              className="text-white font-bold text-lg px-6 py-2 rounded hover:bg-red-700 transition-colors duration-300 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Out / సైన్ అవుట్
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-12">
        <motion.div
          className="bg-red-500 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Bus Animation */}
          <motion.div
            className="absolute top-4 left-0 w-full"
            animate={{ x: ["-10%", "100%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Bus className="w-8 h-8 text-white drop-shadow-lg" />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mt-12">
            {/* Starting Point */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <select
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                aria-label="Starting Point"
                className="w-full px-6 py-4 text-lg rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-700 appearance-none bg-white cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <option value="Starting Point">Starting Point / ప్రారంభ స్థానం</option>
                {stops.map((stop) => (
                  <option key={stop.stopNo} value={stop.stopName}>
                    {stop.stopName}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Destination */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                aria-label="Destination"
                className="w-full px-6 py-4 text-lg rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-700 appearance-none bg-white cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <option value="Destination">Destination / గమ్యం</option>
                {stops.map((stop) => (
                  <option key={stop.stopNo} value={stop.stopName}>
                    {stop.stopName}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, backgroundColor: "#b91c1c" }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-red-600 text-white font-medium py-4 px-6 rounded-xl shadow-lg text-lg transition-all duration-200 hover:shadow-xl"
              >
                Submit
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;