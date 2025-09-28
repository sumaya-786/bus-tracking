import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function App() {
  const navigate = useNavigate(); // ✅ initialize navigate

  const stops = [
    { name: "NTR Circle", eta: "ETA: 0 min", distance: "0 km", color: "green", pos: [16.499819, 80.6729] },
    { name: "Inner Ring Road", eta: "ETA: 1 min", distance: "Arriving soon", color: "yellow", pos: [16.4965, 80.6581] },
    { name: "Pedakakani (Your Stop/మీ స్టాప్)", eta: "ETA: 15 min", distance: "7 km", color: "yellow", pos: [16.4997, 80.6581] },
    { name: "Mangalagiri", eta: "ETA: 21 min", distance: "11 km", color: "yellow", pos: [16.5177, 80.6762] },
    { name: "Krishnayapalem", eta: "ETA: 17 min", distance: "9 km", color: "yellow", pos: [16.511, 80.7464] },
    { name: "VIT-AP", eta: "ETA: 10 min", distance: "6 km", color: "red", pos: [16.5273, 80.6254] },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", height: "100vh" }}>
      {/* Navbar */}
      <div
        style={{
          backgroundColor: "#b30000",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div style={{ flex: 1, textAlign: "left" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            Home / హోమ్
          </span>
        </div>

        {/* Center */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <span style={{ cursor: "pointer" }}>Monitor Location / మానిటర్ లొకేషన్</span>
        </div>

        {/* Right */}
        <div style={{ flex: 1, textAlign: "right" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/signin")}>
            Sign Out / సైన్ అవుట్
          </span>
        </div>
      </div>

      {/* Stops Timeline */}
      <div style={{ display: "flex", height: "calc(100% - 90px)" }}>
        <div
          style={{
            width: "250px",
            padding: "20px",
            backgroundColor: "#f8f8f8",
            borderRight: "1px solid #ddd",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "27px",
              top: "30px",
              bottom: "30px",
              width: "2px",
              backgroundColor: "#ccc",
            }}
          />
          {stops.map((stop, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "30px",
                position: "relative",
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
                  position: "relative",
                }}
              >
                {stop.name === "Inner Ring Road" && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-25px",
                      left: "-10px",
                      fontSize: "20px",
                    }}
                  >
                    🚌
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

        {/* Map */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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

              {stops.map((stop, i) => (
                <Marker key={i} position={stop.pos}>
                  <Popup>
                    {stop.name} <br /> {stop.eta}, Distance: {stop.distance}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Notification */}
          <div
            style={{
              margin: "15px",
              padding: "15px",
              backgroundColor: "#ffb3b3",
              borderRadius: "8px",
              fontWeight: "bold",
              color: "darkred",
              textAlign: "center",
            }}
          >
            "Approaching Inner Ring Road. Expecting a frequency of 3 buses in the upcoming 15 minutes in Route 15."
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: "14px",
          borderTop: "1px solid #ddd",
        }}
      >
        ETA will be sent to your mobile number / మీ మొబైల్ నంబర్‌కి ETA పంపబడుతుంది
      </div>
    </div>
  );
}
