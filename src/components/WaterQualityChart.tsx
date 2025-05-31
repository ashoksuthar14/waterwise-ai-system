
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WaterQualityReading } from '@/types/waterQuality';

interface WaterQualityChartProps {
  data: WaterQualityReading[];
}

export const WaterQualityChart: React.FC<WaterQualityChartProps> = ({ data }) => {
  const chartData = data.slice(-20).map((reading, index) => ({
    time: reading.timestamp.toLocaleTimeString(),
    WQI: reading.wqi,
    pH: reading.pH * 10, // Scale for visibility
    TDS: reading.tds / 10, // Scale for visibility
    DO: reading.dissolvedOxygen * 5, // Scale for visibility
    Temp: reading.temperature
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/90 p-3 rounded-lg border border-water-500/30 backdrop-blur-sm">
          <p className="text-water-200 font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'pH' && `pH: ${(entry.value / 10).toFixed(2)}`}
              {entry.dataKey === 'TDS' && `TDS: ${(entry.value * 10).toFixed(0)} mg/L`}
              {entry.dataKey === 'DO' && `DO: ${(entry.value / 5).toFixed(1)} mg/L`}
              {entry.dataKey === 'WQI' && `WQI: ${entry.value.toFixed(0)}`}
              {entry.dataKey === 'Temp' && `Temperature: ${entry.value.toFixed(1)}°C`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-water-400">
        <div className="text-center">
          <div className="animate-pulse text-2xl mb-2">📊</div>
          <p>Collecting water quality data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => value.split(':').slice(0, 2).join(':')}
          />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="WQI" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 3 }}
            name="WQI"
          />
          <Line 
            type="monotone" 
            dataKey="pH" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 3 }}
            name="pH (×10)"
          />
          <Line 
            type="monotone" 
            dataKey="TDS" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 3 }}
            name="TDS (÷10)"
          />
          <Line 
            type="monotone" 
            dataKey="Temp" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={{ fill: '#EF4444', r: 3 }}
            name="Temperature"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
