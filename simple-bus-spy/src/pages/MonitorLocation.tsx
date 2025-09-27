// App.js
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import { useNavigate } from "react-router-dom"; // ✅ navigation
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Custom Bus Icon for Map
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
  iconSize: [30, 30]
});

export default function App() {
  const navigate = useNavigate();

  // Stops Data
  const stops = [
    { name: "Source", eta: "ETA: 0 min", distance: "0 km", color: "green", pos: [16.499819, 80.6729] },
    { name: "Stop 1", eta: "ETA: N/A", distance: "N/A", color: "yellow", pos: [16.4965, 80.6581] },
    { name: "Stop 2", eta: "ETA: N/A", distance: "N/A", color: "yellow", pos: [16.4997, 80.6581] },
    { name: "Stop 3", eta: "ETA: N/A", distance: "N/A", color: "yellow", pos: [16.5177, 80.6762] },
    { name: "Stop 4", eta: "ETA: N/A", distance: "N/A", color: "yellow", pos: [16.511, 80.7464] },
    { name: "Destination", eta: "ETA: N/A", distance: "N/A", color: "red", pos: [16.5273, 80.6254] }
  ];

  const path = stops.map((s) => s.pos);

  // ✅ Animated bus state
  const [busIndex, setBusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusIndex((prev) => (prev < stops.length - 1 ? prev + 1 : 0));
    }, 3000); // moves every 3s
    return () => clearInterval(interval);
  }, [stops.length]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", height: "100vh" }}>
      {/* Top Navbar */}
      <div
        style={{
          backgroundColor: "#b30000",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/Home")}
        >
          Home / హోమ్
        </span>
        <span>Monitor Location / మానిటర్ లొకేషన్</span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/SignIn")}
        >
          Sign Out / సైన్ అవుట్
        </span>
      </div>

      {/* Layout */}
      <div style={{ display: "flex", height: "calc(100% - 90px)" }}>
        {/* Stops timeline */}
        <div
          style={{
            width: "250px",
            padding: "20px",
            backgroundColor: "#f8f8f8",
            borderRight: "1px solid #ddd",
            position: "relative"
          }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "27px",
              top: "30px",
              bottom: "30px",
              width: "2px",
              backgroundColor: "#ccc"
            }}
          />
          {stops.map((stop, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "30px",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: stop.color,
                  marginRight: "15px",
                  zIndex: 1,
                  position: "relative"
                }}
              >
                {/* 🚍 bus icon above current stop */}
                {busIndex === i && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-25px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "20px"
                    }}
                  >
                    🚍
                  </span>
                )}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{stop.name}</p>
                <p style={{ margin: 0, fontSize: "12px" }}>{stop.eta}</p>
                <p style={{ margin: 0, fontSize: "12px" }}>Distance: {stop.distance}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
          {/* Map */}
          <div style={{ flex: "1", margin: "15px" }}>
            <MapContainer
              center={[16.4997, 80.6581]}
              zoom={12}
              style={{ height: "100%", width: "100%", borderRadius: "10px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {stops.map((stop, i) => (
                <Marker key={i} position={stop.pos}>
                  <Popup>
                    {stop.name} <br /> {stop.eta}, Distance: {stop.distance}
                  </Popup>
                </Marker>
              ))}
              {/* Polyline path */}
              <Polyline positions={path} color="blue" />
              {/* Animated bus marker on map */}
              <Marker position={stops[busIndex].pos} icon={busIcon}>
                <Popup>Bus currently at {stops[busIndex].name}</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Notification below map */}
          <div
            style={{
              margin: "15px",
              padding: "15px",
              backgroundColor: "#ffb3b3",
              borderRadius: "8px",
              fontWeight: "bold",
              color: "darkred",
              textAlign: "center"
            }}
          >
            "Approaching Stop 4. Expecting a frequency of 8 buses in the
            upcoming 15 minutes in Route 15."
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: "14px",
          borderTop: "1px solid #ddd"
        }}
      >
        ETA will be sent to your mobile number / మీ మొబైల్ నంబర్‌కి ETA పంపబడుతుంది
      </div>
    </div>
  );
}
