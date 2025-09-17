import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function ActiveBuses() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Initialize bus positions
  const initialBuses = [
    {
      bus: "15A",
      source: "Autonagar Gate",
      destination: "VIT-AP",
      eta: "5 min",
      path: [
        [16.499819, 80.6729],
        [16.4965, 80.6581],
        [16.4997, 80.6581],
        [16.5273, 80.6254],
      ],
      currentIndex: 0,
      status: "Arriving", // 🚍 Blinking
    },
    {
      bus: "15A", // ✅ Same bus number but different path
      source: "Benz Circle",
      destination: "VIT-AP",
      eta: "7 min",
      path: [
        [16.505, 80.648], // Benz Circle
        [16.515, 80.640], // Mid point
        [16.5273, 80.6254], // VIT-AP
      ],
      currentIndex: 0,
      status: "Left Stop", // 🚍 Normal
    },
    {
      bus: "16B",
      source: "Ganavaram",
      destination: "VIT-AP",
      eta: "Delayed",
      path: [
        [16.5385, 80.7771],
        [16.5177, 80.6762],
        [16.4997, 80.6581],
        [16.5273, 80.6254],
      ],
      currentIndex: 0,
      status: "Arriving", // 🚍 Blinking
    },
  ];

  const [buses, setBuses] = useState(initialBuses);

  // Move buses along the path
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          const nextIndex = bus.currentIndex + 1;
          if (nextIndex >= bus.path.length) return { ...bus, status: "Arrived" };
          return {
            ...bus,
            currentIndex: nextIndex,
            status: nextIndex === bus.path.length - 1 ? "Arriving" : "Left Stop",
          };
        })
      );
    }, 4000); // Every 4 seconds move to next stop
    return () => clearInterval(interval);
  }, []);

  const filteredBuses = buses.filter(
    (b) =>
      b.bus.toLowerCase().includes(search.toLowerCase()) ||
      b.source.toLowerCase().includes(search.toLowerCase()) ||
      b.destination.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "Arriving":
        return "#2979ff";
      case "Left Stop":
        return "#00c853";
      case "Delayed":
        return "#ff6d00";
      case "Arrived":
        return "#9e9e9e";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Active Buses / యాక్టివ్ బస్సులు</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            fontSize: "28px",
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "5px",
          }}
          aria-label="Toggle sidebar"
        >
          &#9776;
        </button>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <motion.div
          animate={{ width: sidebarOpen ? 300 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            flexShrink: 0,
            padding: sidebarOpen ? "15px" : "0px",
            overflowY: "auto",
            backgroundColor: "#fff",
            boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          }}
        >
          {sidebarOpen && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <input
                  type="text"
                  placeholder="Search buses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    width: "100%",
                    fontSize: "16px",
                    outline: "none",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>

              {filteredBuses.map((bus, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: "linear-gradient(to bottom, #ff4d4d, #ff8080)",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "15px",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <p style={{ margin: "5px 0" }}>Bus: {bus.bus}</p>
                  <p style={{ margin: "5px 0" }}>ETA: {bus.eta}</p>
                  <p style={{ margin: "5px 0" }}>Source: {bus.source}</p>
                  <p style={{ margin: "5px 0" }}>Destination: {bus.destination}</p>

                  {/* Live Status Badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      backgroundColor: statusColor(bus.status),
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                      animation:
                        bus.status === "Arriving" ? "blink 1s infinite" : "none",
                    }}
                  >
                    {bus.status}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#0097a7" }}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: "#00bcd4",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                    onClick={() => navigate("/monitor", { state: { bus } })}
                  >
                    View Bus
                  </motion.button>
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        {/* Map Panel */}
        <div style={{ flex: 1, margin: "15px" }}>
          <MapContainer
            center={[16.4997, 80.6581]}
            zoom={12}
            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {filteredBuses.map((bus, i) => (
              <React.Fragment key={i}>
                <Marker position={bus.path[bus.currentIndex]}>
                  <Popup>
                    {bus.bus}: {bus.status}
                  </Popup>
                </Marker>
                <Polyline
                  positions={bus.path}
                  pathOptions={{ color: "blue", weight: 4 }}
                />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Blink animation */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}