
export interface WaterParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  range: {
    min: number;
    max: number;
    optimal: {
      min: number;
      max: number;
    };
  };
  status: 'safe' | 'moderate' | 'hazardous';
  lastUpdated: Date;
}

export interface WaterQualityReading {
  timestamp: Date;
  pH: number;
  tds: number; // Total Dissolved Solids
  turbidity: number;
  dissolvedOxygen: number;
  temperature: number;
  conductivity: number;
  orp: number; // Oxidation Reduction Potential
  wqi: number; // Water Quality Index
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  parameter: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface AIInsight {
  type: 'contamination' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
}
