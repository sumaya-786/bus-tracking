import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bus, MapPin, Clock, Users } from "lucide-react";

// Dummy bus data
const activeBuses = [
  {
    id: "MH12AB1234",
    route: "Central Station → Airport",
    currentStop: "City Mall",
    nextStop: "Tech Park",
    passengers: 28,
    eta: "5 min",
    status: "On Time"
  },
  {
    id: "MH12CD5678",
    route: "Railway Station → Beach Road",
    currentStop: "University",
    nextStop: "Hospital",
    passengers: 15,
    eta: "8 min",
    status: "Delayed"
  },
  {
    id: "MH12EF9012",
    route: "Bus Depot → Shopping Complex",
    currentStop: "Sports Stadium",
    nextStop: "Market Square",
    passengers: 32,
    eta: "3 min",
    status: "On Time"
  },
  {
    id: "MH12GH3456",
    route: "Industrial Area → Residential Zone",
    currentStop: "Factory Gate",
    nextStop: "School Junction",
    passengers: 22,
    eta: "12 min",
    status: "On Time"
  },
  {
    id: "MH12IJ7890",
    route: "Metro Station → Bus Terminal",
    currentStop: "Food Court",
    nextStop: "Park Entrance",
    passengers: 18,
    eta: "6 min",
    status: "Early"
  }
];

const ActiveBuses = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time": return "text-accent";
      case "Delayed": return "text-destructive";
      case "Early": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "On Time": return "bg-accent/10";
      case "Delayed": return "bg-destructive/10";
      case "Early": return "bg-primary/10";
      default: return "bg-muted/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Active Buses</h1>
            <p className="text-white/80 text-sm">{activeBuses.length} buses currently running</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeBuses.map((bus, index) => (
          <Card key={bus.id} className="shadow-md border-0 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Bus ID and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bus className="w-5 h-5 text-primary" />
                    <span className="font-bold text-lg">{bus.id}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(bus.status)} ${getStatusColor(bus.status)}`}>
                    {bus.status}
                  </div>
                </div>

                {/* Route */}
                <div className="bg-transit-blue-light/30 p-3 rounded-lg">
                  <p className="font-medium text-sm text-primary">{bus.route}</p>
                </div>

                {/* Current and Next Stop */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Current Stop</p>
                      <p className="font-medium text-sm">{bus.currentStop}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-transit-gray" />
                    <div>
                      <p className="text-xs text-muted-foreground">Next Stop</p>
                      <p className="font-medium text-sm">{bus.nextStop}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{bus.passengers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{bus.eta}</span>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Back to Home Button */}
        <Card className="shadow-md border-0 bg-gradient-to-r from-secondary/50 to-secondary/30">
          <CardContent className="p-4">
            <Button 
              onClick={() => navigate("/home")}
              variant="outline"
              className="w-full h-12 border-primary/20 hover:bg-primary/5"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActiveBuses;