import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bus, MapPin, Activity } from "lucide-react";

const MonitorLocation = () => {
  const navigate = useNavigate();

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
            <h1 className="text-xl font-bold">Monitor Location</h1>
            <p className="text-white/80 text-sm">Track buses in real-time</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Active Buses Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Live Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/active-buses")}
              className="w-full h-16 text-lg font-medium bg-gradient-to-r from-accent to-transit-green hover:from-accent/90 hover:to-transit-green/90 shadow-lg"
            >
              <Bus className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div>Active Buses</div>
                <div className="text-sm font-normal opacity-90">View running buses</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="shadow-md border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Bus className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Buses Online</p>
                    <p className="text-2xl font-bold text-accent">24</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Active Routes</p>
                    <p className="text-2xl font-bold text-primary">12</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Status */}
        <Card className="shadow-md border-0 bg-transit-blue-light/50">
          <CardContent className="p-4">
            <div className="text-center">
              <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-medium">System Status</p>
              <p className="text-sm text-muted-foreground">All systems operational</p>
              <div className="flex justify-center mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-xs text-accent font-medium">Live</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonitorLocation;