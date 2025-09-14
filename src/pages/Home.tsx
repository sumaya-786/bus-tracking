import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Bus } from "lucide-react";

const Home = () => {
  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Bus className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">BusTracker</h1>
            <p className="text-white/80 text-sm">Find your perfect route</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Plan Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-transit-green" />
                <Input
                  type="text"
                  placeholder="Starting Bus Stand"
                  value={startingPoint}
                  onChange={(e) => setStartingPoint(e.target.value)}
                  className="pl-10 h-12 text-base border-border/50 focus:border-transit-green"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-destructive" />
                <Input
                  type="text"
                  placeholder="Destination Bus Stand"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10 h-12 text-base border-border/50 focus:border-destructive"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitor Location Button */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <Button 
              onClick={() => navigate("/monitor")}
              className="w-full h-14 text-lg font-medium bg-gradient-to-r from-accent to-transit-green hover:from-accent/90 hover:to-transit-green/90 shadow-lg"
            >
              <Navigation className="w-6 h-6 mr-2" />
              Monitor Location
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Bus className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Live Tracking</p>
              <p className="text-xs text-muted-foreground">Real-time updates</p>
            </CardContent>
          </Card>
          <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium">Nearby Stops</p>
              <p className="text-xs text-muted-foreground">Find closest stops</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;