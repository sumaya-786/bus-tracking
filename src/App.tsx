import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import MonitorLocation from "./pages/MonitorLocation";
import ActiveBuses from "./pages/ActiveBuses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global notifications */}
        <Toaster />
        <Sonner />

        {/* Routing */}
        <BrowserRouter>
          <Routes>
            {/* 👇 Default route redirects to SignIn */}
            <Route path="/" element={<Navigate to="/signin" replace />} />

            <Route path="/signin" element={<SignIn />} />
            <Route path="/home" element={<Home />} />
            <Route path="/monitor" element={<MonitorLocation />} />
            <Route path="/active-buses" element={<ActiveBuses />} />

            {/* Fallback for unknown paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
