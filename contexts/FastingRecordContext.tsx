import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FastingRecord {
  date: string; // YYYY-MM-DD format
  hours: number;
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  notes?: string;
  completed: boolean;
}

interface FastingRecordContextType {
  records: FastingRecord[];
  addRecord: (record: FastingRecord) => void;
  updateRecord: (date: string, record: Partial<FastingRecord>) => void;
  getRecord: (date: string) => FastingRecord | undefined;
  getMonthRecords: (year: number, month: number) => FastingRecord[];
  deleteRecord: (date: string) => void;
}

const FastingRecordContext = createContext<FastingRecordContextType | undefined>(undefined);

export function FastingRecordProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<FastingRecord[]>([
    // Sample data for demonstration
    {
      date: '2024-12-01',
      hours: 16,
      startTime: '20:00',
      endTime: '12:00',
      completed: true,
      notes: 'Felt great!'
    },
    {
      date: '2024-12-02',
      hours: 14,
      startTime: '21:00',
      endTime: '11:00',
      completed: true,
    },
    {
      date: '2024-12-03',
      hours: 18,
      startTime: '19:00',
      endTime: '13:00',
      completed: true,
    },
    {
      date: '2024-12-05',
      hours: 12,
      startTime: '22:00',
      endTime: '10:00',
      completed: false,
      notes: 'Broke fast early'
    },
    {
      date: '2024-12-07',
      hours: 16,
      startTime: '20:00',
      endTime: '12:00',
      completed: true,
    },
    {
      date: '2024-12-08',
      hours: 15,
      startTime: '20:30',
      endTime: '11:30',
      completed: true,
    },
    {
      date: '2024-12-10',
      hours: 17,
      startTime: '19:30',
      endTime: '12:30',
      completed: true,
    },
    // Add more recent sample data
    {
      date: '2024-12-11',
      hours: 16,
      startTime: '20:00',
      endTime: '12:00',
      completed: true,
    },
    {
      date: '2024-12-12',
      hours: 18,
      startTime: '19:00',
      endTime: '13:00',
      completed: true,
    },
    {
      date: '2024-12-13',
      hours: 14,
      startTime: '21:00',
      endTime: '11:00',
      completed: false,
      notes: 'Felt tired, broke fast early'
    },
    {
      date: '2024-12-14',
      hours: 16,
      startTime: '20:00',
      endTime: '12:00',
      completed: true,
    },
    {
      date: '2024-12-15',
      hours: 17,
      startTime: '19:30',
      endTime: '12:30',
      completed: true,
    },
    {
      date: '2024-12-16',
      hours: 16,
      startTime: '20:00',
      endTime: '12:00',
      completed: true,
    },
  ]);

  const addRecord = (record: FastingRecord) => {
    setRecords(prev => {
      const filtered = prev.filter(r => r.date !== record.date);
      return [...filtered, record].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const updateRecord = (date: string, updates: Partial<FastingRecord>) => {
    setRecords(prev => prev.map(record => 
      record.date === date ? { ...record, ...updates } : record
    ));
  };

  const getRecord = (date: string) => {
    return records.find(record => record.date === date);
  };

  const getMonthRecords = (year: number, month: number) => {
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString();
    return records.filter(record => 
      record.date.startsWith(`${yearStr}-${monthStr}`)
    );
  };

  const deleteRecord = (date: string) => {
    setRecords(prev => prev.filter(record => record.date !== date));
  };

  return (
    <FastingRecordContext.Provider value={{
      records,
      addRecord,
      updateRecord,
      getRecord,
      getMonthRecords,
      deleteRecord,
    }}>
      {children}
    </FastingRecordContext.Provider>
  );
}

export function useFastingRecord() {
  const context = useContext(FastingRecordContext);
  if (context === undefined) {
    throw new Error('useFastingRecord must be used within a FastingRecordProvider');
  }
  return context;
}