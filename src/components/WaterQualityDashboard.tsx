
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWaterQualityData } from '@/hooks/useWaterQualityData';
import { usePerplexityAI } from '@/hooks/usePerplexityAI';
import { WaterQualityChart } from './WaterQualityChart';
import { AlertsPanel } from './AlertsPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { ParameterCard } from './ParameterCard';
import { Droplets, Activity, Brain, RefreshCw } from 'lucide-react';

export const WaterQualityDashboard: React.FC = () => {
  const { currentReading, historicalData, waterParameters, alerts, isConnected, clearAlerts } = useWaterQualityData();
  const { insights, isLoading, analyzeWaterQuality, predictWaterQuality } = usePerplexityAI();

  useEffect(() => {
    if (historicalData.length > 0 && historicalData.length % 5 === 0) {
      analyzeWaterQuality(currentReading, historicalData);
    }
  }, [historicalData.length, currentReading, analyzeWaterQuality]);

  const getWQIStatus = (wqi: number) => {
    if (wqi >= 80) return { status: 'Excellent', color: 'bg-green-500', textColor: 'text-green-500' };
    if (wqi >= 60) return { status: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500' };
    if (wqi >= 40) return { status: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    if (wqi >= 20) return { status: 'Poor', color: 'bg-orange-500', textColor: 'text-orange-500' };
    return { status: 'Very Poor', color: 'bg-red-500', textColor: 'text-red-500' };
  };

  const wqiStatus = getWQIStatus(currentReading.wqi);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Droplets className="h-8 w-8 text-water-400 animate-pulse-blue" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-water-300 to-water-500 bg-clip-text text-transparent">
              WaterWise AI System
            </h1>
            <Droplets className="h-8 w-8 text-water-400 animate-pulse-blue" />
          </div>
          <p className="text-water-200 text-lg">
            Smart Water Quality Monitoring & Prediction System
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-water-300">
              {isConnected ? 'Sensors Connected' : 'Connection Lost'}
            </span>
          </div>
        </div>

        {/* Main WQI Display */}
        <Card className="glass-morphism border-water-500/30">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-water-100">Water Quality Index</h2>
              <div className="relative">
                <div className="text-6xl font-bold text-water-300">{currentReading.wqi.toFixed(0)}</div>
                <Progress value={currentReading.wqi} className="mt-4 h-3" />
              </div>
              <Badge className={`${wqiStatus.color} text-white text-lg px-4 py-2`}>
                {wqiStatus.status}
              </Badge>
              <p className="text-water-300 text-sm">
                Last updated: {currentReading.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Parameter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {waterParameters.map((parameter) => (
            <ParameterCard key={parameter.id} parameter={parameter} />
          ))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-morphism border-water-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-water-100">
                <Activity className="h-5 w-5 text-water-400" />
                Real-time Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WaterQualityChart data={historicalData} />
            </CardContent>
          </Card>

          <Card className="glass-morphism border-water-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-water-100">
                <Brain className="h-5 w-5 text-water-400" />
                AI Insights
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => predictWaterQuality(historicalData)}
                  disabled={isLoading}
                  className="ml-auto border-water-500/50 text-water-300 hover:bg-water-500/20"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Analyze
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIInsightsPanel insights={insights} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel */}
        {alerts.length > 0 && (
          <Card className="glass-morphism border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-300">System Alerts</CardTitle>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearAlerts}
                className="ml-auto border-red-500/50 text-red-300 hover:bg-red-500/20"
              >
                Clear All
              </Button>
            </CardHeader>
            <CardContent>
              <AlertsPanel alerts={alerts} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
