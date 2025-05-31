
import { useState } from 'react';
import { AIInsight } from '@/types/waterQuality';

const PERPLEXITY_API_KEY = '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';

export const usePerplexityAI = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeWaterQuality = async (parameters: any, historicalData: any[]) => {
    setIsLoading(true);
    
    try {
      const waterQualityPrompt = `
        Analyze this water quality data and provide insights:
        
        Current Parameters:
        - pH: ${parameters.pH?.toFixed(2)}
        - TDS: ${parameters.tds?.toFixed(2)} mg/L
        - Turbidity: ${parameters.turbidity?.toFixed(2)} NTU
        - Dissolved Oxygen: ${parameters.dissolvedOxygen?.toFixed(2)} mg/L
        - Temperature: ${parameters.temperature?.toFixed(2)} °C
        - Conductivity: ${parameters.conductivity?.toFixed(2)} μS/cm
        - Water Quality Index: ${parameters.wqi?.toFixed(2)}
        
        Historical trend: ${historicalData.length} readings over time
        
        Please provide:
        1. Overall water quality assessment
        2. Any contamination risks
        3. Recommendations for improvement
        4. Predicted trends based on current values
        
        Be precise and focus on actionable insights for water management.
      `;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a water quality expert AI. Provide concise, actionable insights about water quality data. Focus on health implications, contamination risks, and practical recommendations.'
            },
            {
              role: 'user',
              content: waterQualityPrompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Unable to analyze water quality data.';
      
      // Parse the response into structured insights
      const newInsights: AIInsight[] = [
        {
          type: 'contamination',
          title: 'Water Quality Analysis',
          description: aiResponse,
          confidence: 0.85,
          timestamp: new Date()
        }
      ];

      setInsights(prev => [...newInsights, ...prev].slice(0, 10));
      
    } catch (error) {
      console.error('Error analyzing water quality:', error);
      
      // Fallback insights based on current parameters
      const fallbackInsights: AIInsight[] = [
        {
          type: 'recommendation',
          title: 'System Analysis',
          description: `Current water quality analysis: pH ${parameters.pH?.toFixed(2)}, WQI ${parameters.wqi?.toFixed(2)}. ${parameters.wqi > 70 ? 'Water quality is good.' : 'Water quality needs attention.'}`,
          confidence: 0.7,
          timestamp: new Date()
        }
      ];
      
      setInsights(prev => [...fallbackInsights, ...prev].slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  const predictWaterQuality = async (historicalData: any[]) => {
    if (historicalData.length < 5) return;
    
    setIsLoading(true);
    
    try {
      const trendData = historicalData.slice(-10).map(reading => ({
        wqi: reading.wqi,
        pH: reading.pH,
        tds: reading.tds,
        timestamp: reading.timestamp
      }));

      const predictionPrompt = `
        Based on these recent water quality trends, predict future water quality:
        
        Recent WQI values: ${trendData.map(d => d.wqi.toFixed(1)).join(', ')}
        Recent pH values: ${trendData.map(d => d.pH.toFixed(2)).join(', ')}
        Recent TDS values: ${trendData.map(d => d.tds.toFixed(1)).join(', ')}
        
        Provide:
        1. Short-term prediction (next 24 hours)
        2. Potential risks to watch for
        3. Preventive measures
        
        Be specific and actionable.
      `;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a predictive water quality AI. Analyze trends and provide forecasts with actionable recommendations.'
            },
            {
              role: 'user',
              content: predictionPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const prediction = data.choices[0]?.message?.content || 'Unable to generate prediction.';
        
        const predictionInsight: AIInsight = {
          type: 'prediction',
          title: 'Water Quality Forecast',
          description: prediction,
          confidence: 0.8,
          timestamp: new Date()
        };

        setInsights(prev => [predictionInsight, ...prev].slice(0, 10));
      }
      
    } catch (error) {
      console.error('Error predicting water quality:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    insights,
    isLoading,
    analyzeWaterQuality,
    predictWaterQuality
  };
};
