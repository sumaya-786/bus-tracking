import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      navigate("/home"); // ✅ Redirect to Home.tsx
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left side - Sign in form */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/3 bg-white flex flex-col justify-center px-6 md:px-12 shadow-lg z-10"
      >
        <div className="max-w-sm mx-auto">
          {/* Heading with underline */}
          <div className="text-center">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              Sign in / సైన్ ఇన్
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="h-1 bg-red-500 mb-8 mx-auto"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mb-8"
            >
              <input
                type="tel"
                placeholder="Phone number / ఫోన్ నంబర్"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-red-500 
                           focus:border-transparent transition-shadow duration-300 
                           shadow-sm hover:shadow-md"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white 
                         font-medium py-3 px-6 rounded-full transition-colors 
                         duration-200 shadow-md"
            >
              Submit / సబ్మిట్
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Right side - Illustration */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full md:w-2/3 h-64 md:h-auto 
                   bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 
                   relative overflow-hidden"
      >
        {/* Floating decorative dots */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute top-16 right-16 w-4 h-4 bg-white/30 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-32 right-32 w-3 h-3 bg-white/20 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-24 right-64 w-5 h-5 bg-white/25 rounded-full"
        />

        {/* City skyline silhouette */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-0 left-0 right-0"
        >
          <svg viewBox="0 0 800 300" className="w-full h-64">
            <defs>
              <linearGradient id="cityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
              </linearGradient>
            </defs>
            {/* Buildings */}
            <rect x="50" y="150" width="40" height="150" fill="url(#cityGradient)" />
            <rect x="100" y="100" width="50" height="200" fill="url(#cityGradient)" />
            <rect x="160" y="120" width="35" height="180" fill="url(#cityGradient)" />
            <rect x="200" y="80" width="60" height="220" fill="url(#cityGradient)" />
            <rect x="270" y="110" width="45" height="190" fill="url(#cityGradient)" />
            <rect x="320" y="90" width="40" height="210" fill="url(#cityGradient)" />
            <rect x="370" y="130" width="55" height="170" fill="url(#cityGradient)" />
            <rect x="430" y="105" width="38" height="195" fill="url(#cityGradient)" />
            <rect x="480" y="85" width="50" height="215" fill="url(#cityGradient)" />
            <rect x="540" y="95" width="42" height="205" fill="url(#cityGradient)" />
            <rect x="590" y="125" width="48" height="175" fill="url(#cityGradient)" />
            <rect x="650" y="110" width="44" height="190" fill="url(#cityGradient)" />
            <rect x="700" y="140" width="36" height="160" fill="url(#cityGradient)" />
          </svg>
        </motion.div>

        {/* Tree silhouette */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-16 left-8"
        >
          <svg width="120" height="180" viewBox="0 0 120 180">
            <rect x="52" y="120" width="16" height="60" fill="saddlebrown" />
            <ellipse cx="60" cy="80" rx="45" ry="50" fill="rgba(34,139,34,0.7)" />
            <ellipse cx="45" cy="70" rx="30" ry="35" fill="rgba(46,139,87,0.6)" />
            <ellipse cx="75" cy="75" rx="35" ry="40" fill="rgba(60,179,113,0.6)" />
          </svg>
        </motion.div>

        {/* Person silhouette */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-20 right-32"
        >
          <svg width="60" height="100" viewBox="0 0 60 100">
            <circle cx="30" cy="15" r="8" fill="saddlebrown" />
            <rect x="25" y="22" width="10" height="35" rx="2" fill="saddlebrown" />
            <rect x="15" y="25" width="8" height="20" rx="2" fill="saddlebrown" />
            <rect x="37" y="25" width="8" height="20" rx="2" fill="saddlebrown" />
            <rect x="22" y="55" width="6" height="30" rx="2" fill="saddlebrown" />
            <rect x="32" y="55" width="6" height="30" rx="2" fill="saddlebrown" />
          </svg>
        </motion.div>

        {/* Bus stop sign */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-32 right-48"
        >
          <div className="w-2 h-24 bg-gray-600"></div>
          <div className="w-8 h-8 bg-blue-600 rounded-sm -mt-20 ml-6 flex items-center justify-center">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;
