import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

interface CyclePhaseData {
  name: string;
  days: string;
  recommendedHours: number;
  fastingWindow: string;
  color: string;
  description: string;
}

interface CycleContextType {
  selectedPhase: CyclePhase;
  setSelectedPhase: (phase: CyclePhase) => void;
  getCurrentPhaseData: () => CyclePhaseData;
  customHours: number | null;
  setCustomHours: (hours: number | null) => void;
  getEffectiveHours: () => number;
  isUsingCustomTimer: boolean;
}

const cyclePhases: Record<CyclePhase, CyclePhaseData> = {
  menstrual: {
    name: 'Menstrual Phase',
    days: '1-7',
    recommendedHours: 12,
    fastingWindow: '12:12',
    color: '#DC2626',
    description: 'Rest and gentle fasting',
  },
  follicular: {
    name: 'Follicular Phase',
    days: '1-13',
    recommendedHours: 16,
    fastingWindow: '16:8',
    color: '#10B981',
    description: 'Building energy phase',
  },
  ovulation: {
    name: 'Ovulation Phase',
    days: '14',
    recommendedHours: 18,
    fastingWindow: '18:6',
    color: '#F59E0B',
    description: 'Peak energy and metabolism',
  },
  luteal: {
    name: 'Luteal Phase',
    days: '15-28',
    recommendedHours: 14,
    fastingWindow: '14:10',
    color: '#8B5CF6',
    description: 'Prepare for next cycle',
  },
};

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function CycleProvider({ children }: { children: ReactNode }) {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>('follicular');
  const [customHours, setCustomHours] = useState<number | null>(null);

  const getCurrentPhaseData = () => cyclePhases[selectedPhase];

  const getEffectiveHours = () => {
    return customHours !== null ? customHours : getCurrentPhaseData().recommendedHours;
  };

  const isUsingCustomTimer = customHours !== null;
  return (
    <CycleContext.Provider value={{
      selectedPhase,
      setSelectedPhase,
      getCurrentPhaseData,
      customHours,
      setCustomHours,
      getEffectiveHours,
      isUsingCustomTimer,
    }}>
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
}