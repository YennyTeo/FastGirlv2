import React, { createContext, useContext, ReactNode } from 'react';

export interface FastingPhase {
  hour: number;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  icon: string;
  intensity: 'low' | 'medium' | 'high';
}

const fastingPhases: FastingPhase[] = [
  {
    hour: 0,
    title: 'Fed State',
    description: 'Your body is processing the last meal',
    benefits: ['Digestion active', 'Insulin elevated', 'Glucose being used'],
    color: '#6B7280',
    icon: '🍽️',
    intensity: 'low'
  },
  {
    hour: 1,
    title: 'Early Digestion',
    description: 'Food is being broken down and absorbed',
    benefits: ['Nutrients entering bloodstream', 'Energy readily available', 'Metabolism active'],
    color: '#6B7280',
    icon: '⚡',
    intensity: 'low'
  },
  {
    hour: 2,
    title: 'Post-Absorptive',
    description: 'Transitioning from fed to fasted state',
    benefits: ['Insulin starting to drop', 'Glycogen stores being used', 'Fat oxidation beginning'],
    color: '#8B5CF6',
    icon: '🔄',
    intensity: 'low'
  },
  {
    hour: 3,
    title: 'Early Fasting',
    description: 'Body switches to stored energy',
    benefits: ['Glycogen breakdown active', 'Insulin levels dropping', 'Fat burning increases'],
    color: '#8B5CF6',
    icon: '🔥',
    intensity: 'medium'
  },
  {
    hour: 4,
    title: 'Glycogen Depletion',
    description: 'Liver glycogen stores being utilized',
    benefits: ['Enhanced fat oxidation', 'Ketone production starts', 'Mental clarity improves'],
    color: '#10B981',
    icon: '🧠',
    intensity: 'medium'
  },
  {
    hour: 6,
    title: 'Fat Burning Mode',
    description: 'Primary fuel source shifts to fat',
    benefits: ['Significant fat oxidation', 'Ketones increasing', 'Appetite suppression'],
    color: '#10B981',
    icon: '💪',
    intensity: 'medium'
  },
  {
    hour: 8,
    title: 'Metabolic Switch',
    description: 'Deep metabolic adaptation occurring',
    benefits: ['Optimal fat burning', 'Ketosis deepening', 'Growth hormone rising'],
    color: '#F59E0B',
    icon: '⚡',
    intensity: 'high'
  },
  {
    hour: 10,
    title: 'Enhanced Ketosis',
    description: 'Body fully adapted to fasting state',
    benefits: ['Peak ketone production', 'Maximum mental clarity', 'Cellular repair active'],
    color: '#F59E0B',
    icon: '🌟',
    intensity: 'high'
  },
  {
    hour: 12,
    title: 'Autophagy Activation',
    description: 'Cellular cleanup and renewal begins',
    benefits: ['Autophagy initiated', 'Cellular detox', 'Anti-aging benefits'],
    color: '#E91E63',
    icon: '🔬',
    intensity: 'high'
  },
  {
    hour: 14,
    title: 'Deep Autophagy',
    description: 'Intensive cellular repair and renewal',
    benefits: ['Enhanced autophagy', 'Protein recycling', 'Immune system boost'],
    color: '#E91E63',
    icon: '🛡️',
    intensity: 'high'
  },
  {
    hour: 16,
    title: 'Optimal Fasting',
    description: 'Peak fasting benefits achieved',
    benefits: ['Maximum autophagy', 'Stem cell activation', 'Longevity pathways active'],
    color: '#DC2626',
    icon: '💎',
    intensity: 'high'
  },
  {
    hour: 18,
    title: 'Extended Benefits',
    description: 'Advanced fasting state with enhanced benefits',
    benefits: ['Deep cellular renewal', 'Enhanced neuroplasticity', 'Maximum fat adaptation'],
    color: '#DC2626',
    icon: '🚀',
    intensity: 'high'
  }
];

interface FastingPhaseContextType {
  getFastingPhase: (hours: number) => FastingPhase;
  getAllPhases: () => FastingPhase[];
  getPhaseProgress: (hours: number) => number;
}

const FastingPhaseContext = createContext<FastingPhaseContextType | undefined>(undefined);

export function FastingPhaseProvider({ children }: { children: ReactNode }) {
  const getFastingPhase = (hours: number): FastingPhase => {
    // Find the appropriate phase based on hours
    const sortedPhases = [...fastingPhases].sort((a, b) => b.hour - a.hour);
    const currentPhase = sortedPhases.find(phase => hours >= phase.hour) || fastingPhases[0];
    return currentPhase;
  };

  const getAllPhases = (): FastingPhase[] => {
    return fastingPhases;
  };

  const getPhaseProgress = (hours: number): number => {
    const currentPhase = getFastingPhase(hours);
    const nextPhaseIndex = fastingPhases.findIndex(p => p.hour > hours);
    
    if (nextPhaseIndex === -1) {
      // We're at or beyond the last phase
      return 100;
    }
    
    const nextPhase = fastingPhases[nextPhaseIndex];
    const progress = ((hours - currentPhase.hour) / (nextPhase.hour - currentPhase.hour)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <FastingPhaseContext.Provider value={{
      getFastingPhase,
      getAllPhases,
      getPhaseProgress,
    }}>
      {children}
    </FastingPhaseContext.Provider>
  );
}

export function useFastingPhase() {
  const context = useContext(FastingPhaseContext);
  if (context === undefined) {
    throw new Error('useFastingPhase must be used within a FastingPhaseProvider');
  }
  return context;
}