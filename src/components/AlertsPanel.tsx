
import React from 'react';
import { Alert } from '@/types/waterQuality';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getAlertBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default:
        return 'bg-water-500/20 text-water-300 border-water-500/50';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-water-400">
        <div className="text-2xl mb-2">✅</div>
        <p>All systems normal - No alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
        >
          {getAlertIcon(alert.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-water-100">{alert.parameter}</span>
              <Badge className={getAlertBadgeColor(alert.severity)}>
                {alert.severity}
              </Badge>
            </div>
            <p className="text-sm text-water-300">{alert.message}</p>
            <p className="text-xs text-water-400 mt-1">
              {alert.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
