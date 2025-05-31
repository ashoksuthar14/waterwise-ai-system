
import React from 'react';
import { AIInsight } from '@/types/waterQuality';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  isLoading: boolean;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, isLoading }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'contamination':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'prediction':
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case 'recommendation':
        return <Brain className="h-4 w-4 text-green-400" />;
      default:
        return <Brain className="h-4 w-4 text-water-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'contamination':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'prediction':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'recommendation':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      default:
        return 'bg-water-500/20 text-water-300 border-water-500/50';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin text-2xl mb-2">🧠</div>
        <p className="text-water-400">AI analyzing water quality data...</p>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-8 text-water-400">
        <div className="text-2xl mb-2">🤖</div>
        <p>Click "Analyze" to get AI insights about your water quality</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {insights.map((insight, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
        >
          <div className="flex items-start gap-3">
            {getInsightIcon(insight.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-water-100">{insight.title}</span>
                <Badge className={getInsightColor(insight.type)}>
                  {insight.type}
                </Badge>
                <Badge variant="outline" className="text-xs text-water-400 border-water-500/50">
                  {Math.round(insight.confidence * 100)}% confidence
                </Badge>
              </div>
              <p className="text-sm text-water-300 leading-relaxed whitespace-pre-wrap">
                {insight.description}
              </p>
              <p className="text-xs text-water-400 mt-2">
                {insight.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
