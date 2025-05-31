
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WaterParameter } from '@/types/waterQuality';
import { TrendingUp, TrendingDown, Minus, Droplets, Thermometer, Activity, Zap } from 'lucide-react';

interface ParameterCardProps {
  parameter: WaterParameter;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({ parameter }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ph':
        return <Activity className="h-4 w-4" />;
      case 'temperature':
        return <Thermometer className="h-4 w-4" />;
      case 'conductivity':
        return <Zap className="h-4 w-4" />;
      default:
        return <Droplets className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'moderate':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'hazardous':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      default:
        return 'text-water-400 border-water-500/30 bg-water-500/10';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'hazardous':
        return 'bg-red-500';
      default:
        return 'bg-water-500';
    }
  };

  const percentage = ((parameter.value - parameter.range.min) / (parameter.range.max - parameter.range.min)) * 100;
  const isInOptimalRange = parameter.value >= parameter.range.optimal.min && parameter.value <= parameter.range.optimal.max;

  return (
    <Card className={`glass-morphism water-ripple ${getStatusColor(parameter.status)}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getIcon(parameter.id)}
            <span className="text-water-100">{parameter.name}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(parameter.status)} border-current`}
          >
            {parameter.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-water-100">
            {parameter.value.toFixed(2)}
          </div>
          <div className="text-sm text-water-300">{parameter.unit}</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-water-400">
            <span>{parameter.range.min}</span>
            <span className="text-water-300">
              Optimal: {parameter.range.optimal.min}-{parameter.range.optimal.max}
            </span>
            <span>{parameter.range.max}</span>
          </div>
          <Progress 
            value={Math.max(0, Math.min(100, percentage))} 
            className="h-2"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-water-400">
            {parameter.lastUpdated.toLocaleTimeString()}
          </span>
          {isInOptimalRange ? (
            <div className="flex items-center gap-1 text-green-400">
              <Minus className="h-3 w-3" />
              <span>Optimal</span>
            </div>
          ) : parameter.value > parameter.range.optimal.max ? (
            <div className="flex items-center gap-1 text-red-400">
              <TrendingUp className="h-3 w-3" />
              <span>High</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-400">
              <TrendingDown className="h-3 w-3" />
              <span>Low</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
