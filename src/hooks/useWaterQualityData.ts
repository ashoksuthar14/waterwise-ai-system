
import { useState, useEffect, useCallback } from 'react';
import { WaterParameter, WaterQualityReading, Alert } from '@/types/waterQuality';

const generateRandomReading = (): WaterQualityReading => {
  const pH = 6.5 + Math.random() * 2; // 6.5-8.5
  const tds = 100 + Math.random() * 400; // 100-500 mg/L
  const turbidity = Math.random() * 5; // 0-5 NTU
  const dissolvedOxygen = 5 + Math.random() * 5; // 5-10 mg/L
  const temperature = 20 + Math.random() * 15; // 20-35°C
  const conductivity = 200 + Math.random() * 600; // 200-800 μS/cm
  const orp = 200 + Math.random() * 400; // 200-600 mV
  
  // Calculate WQI (simplified)
  const wqi = Math.min(100, Math.max(0, 
    (pH >= 6.5 && pH <= 8.5 ? 25 : 10) +
    (tds <= 300 ? 25 : 15) +
    (turbidity <= 1 ? 25 : 15) +
    (dissolvedOxygen >= 6 ? 25 : 10)
  ));

  return {
    timestamp: new Date(),
    pH,
    tds,
    turbidity,
    dissolvedOxygen,
    temperature,
    conductivity,
    orp,
    wqi
  };
};

const getParameterStatus = (value: number, range: any): 'safe' | 'moderate' | 'hazardous' => {
  if (value >= range.optimal.min && value <= range.optimal.max) return 'safe';
  if (value >= range.min && value <= range.max) return 'moderate';
  return 'hazardous';
};

export const useWaterQualityData = () => {
  const [currentReading, setCurrentReading] = useState<WaterQualityReading>(() => generateRandomReading());
  const [historicalData, setHistoricalData] = useState<WaterQualityReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  const waterParameters: WaterParameter[] = [
    {
      id: 'ph',
      name: 'pH Level',
      value: currentReading.pH,
      unit: '',
      range: { min: 0, max: 14, optimal: { min: 6.5, max: 8.5 } },
      status: getParameterStatus(currentReading.pH, { min: 0, max: 14, optimal: { min: 6.5, max: 8.5 } }),
      lastUpdated: currentReading.timestamp
    },
    {
      id: 'tds',
      name: 'Total Dissolved Solids',
      value: currentReading.tds,
      unit: 'mg/L',
      range: { min: 0, max: 1000, optimal: { min: 50, max: 300 } },
      status: getParameterStatus(currentReading.tds, { min: 0, max: 1000, optimal: { min: 50, max: 300 } }),
      lastUpdated: currentReading.timestamp
    },
    {
      id: 'turbidity',
      name: 'Turbidity',
      value: currentReading.turbidity,
      unit: 'NTU',
      range: { min: 0, max: 20, optimal: { min: 0, max: 1 } },
      status: getParameterStatus(currentReading.turbidity, { min: 0, max: 20, optimal: { min: 0, max: 1 } }),
      lastUpdated: currentReading.timestamp
    },
    {
      id: 'do',
      name: 'Dissolved Oxygen',
      value: currentReading.dissolvedOxygen,
      unit: 'mg/L',
      range: { min: 0, max: 15, optimal: { min: 6, max: 12 } },
      status: getParameterStatus(currentReading.dissolvedOxygen, { min: 0, max: 15, optimal: { min: 6, max: 12 } }),
      lastUpdated: currentReading.timestamp
    },
    {
      id: 'temperature',
      name: 'Temperature',
      value: currentReading.temperature,
      unit: '°C',
      range: { min: 0, max: 50, optimal: { min: 15, max: 25 } },
      status: getParameterStatus(currentReading.temperature, { min: 0, max: 50, optimal: { min: 15, max: 25 } }),
      lastUpdated: currentReading.timestamp
    },
    {
      id: 'conductivity',
      name: 'Electrical Conductivity',
      value: currentReading.conductivity,
      unit: 'μS/cm',
      range: { min: 0, max: 2000, optimal: { min: 200, max: 800 } },
      status: getParameterStatus(currentReading.conductivity, { min: 0, max: 2000, optimal: { min: 200, max: 800 } }),
      lastUpdated: currentReading.timestamp
    }
  ];

  const generateAlert = useCallback((parameter: WaterParameter): Alert | null => {
    if (parameter.status === 'hazardous') {
      return {
        id: `alert-${parameter.id}-${Date.now()}`,
        type: 'danger',
        parameter: parameter.name,
        message: `${parameter.name} is at critical levels: ${parameter.value.toFixed(2)} ${parameter.unit}`,
        timestamp: new Date(),
        severity: 'high'
      };
    } else if (parameter.status === 'moderate') {
      return {
        id: `alert-${parameter.id}-${Date.now()}`,
        type: 'warning',
        parameter: parameter.name,
        message: `${parameter.name} is outside optimal range: ${parameter.value.toFixed(2)} ${parameter.unit}`,
        timestamp: new Date(),
        severity: 'medium'
      };
    }
    return null;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newReading = generateRandomReading();
      setCurrentReading(newReading);
      
      setHistoricalData(prev => {
        const newHistory = [...prev, newReading];
        return newHistory.slice(-50); // Keep last 50 readings
      });

      // Check for alerts
      const parameters = waterParameters;
      const newAlerts: Alert[] = [];
      
      parameters.forEach(param => {
        const alert = generateAlert(param);
        if (alert) {
          newAlerts.push(alert);
        }
      });

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 20)); // Keep last 20 alerts
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [generateAlert]);

  const clearAlerts = () => setAlerts([]);

  return {
    currentReading,
    historicalData,
    waterParameters,
    alerts,
    isConnected,
    clearAlerts
  };
};
