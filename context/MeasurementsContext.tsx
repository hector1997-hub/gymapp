import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BodyMeasurement,
  BodyPartId,
} from '@/types/measurements';

interface MeasurementsContextType {
  measurements: BodyMeasurement[];
  addMeasurement: (bodyPartId: BodyPartId, value: number, date?: string, notes?: string) => void;
  deleteMeasurement: (id: string) => void;
  getMeasurementsByPart: (bodyPartId: BodyPartId) => BodyMeasurement[];
  loadMeasurements: () => Promise<void>;
}

const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

const STORAGE_KEY = '@gymapp:body_measurements';

export function MeasurementsProvider({ children }: { children: ReactNode }) {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);

  useEffect(() => {
    loadMeasurements();
  }, []);

  const saveMeasurements = async (data: BodyMeasurement[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setMeasurements(data);
    } catch (error) {
      console.error('Error guardando mediciones:', error);
    }
  };

  const addMeasurement = (
    bodyPartId: BodyPartId,
    value: number,
    date?: string,
    notes?: string
  ) => {
    const newMeasurement: BodyMeasurement = {
      id: Date.now().toString(),
      bodyPartId,
      value,
      date: date || new Date().toISOString(),
      notes,
    };
    const updated = [newMeasurement, ...measurements];
    saveMeasurements(updated);
  };

  const deleteMeasurement = (id: string) => {
    const updated = measurements.filter((m) => m.id !== id);
    saveMeasurements(updated);
  };

  const getMeasurementsByPart = (bodyPartId: BodyPartId) => {
    return measurements
      .filter((m) => m.bodyPartId === bodyPartId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const loadMeasurements = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setMeasurements(JSON.parse(data));
    } catch (error) {
      console.error('Error cargando mediciones:', error);
    }
  };

  return (
    <MeasurementsContext.Provider
      value={{
        measurements,
        addMeasurement,
        deleteMeasurement,
        getMeasurementsByPart,
        loadMeasurements,
      }}>
      {children}
    </MeasurementsContext.Provider>
  );
}

export function useMeasurements() {
  const context = useContext(MeasurementsContext);
  if (context === undefined) {
    throw new Error('useMeasurements debe usarse dentro de MeasurementsProvider');
  }
  return context;
}
