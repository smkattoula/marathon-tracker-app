import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Unit = 'miles' | 'km';

interface UnitContextType {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unit, setUnitState] = useState<Unit>('miles');

  useEffect(() => {
    loadUnitPreference();
  }, []);

  const loadUnitPreference = async () => {
    try {
      const savedUnit = await AsyncStorage.getItem('unitPreference');
      if (savedUnit === 'km' || savedUnit === 'miles') {
        setUnitState(savedUnit);
      }
    } catch (error) {
      console.error('Failed to load unit preference:', error);
    }
  };

  const setUnit = async (newUnit: Unit) => {
    try {
      setUnitState(newUnit);
      await AsyncStorage.setItem('unitPreference', newUnit);
    } catch (error) {
      console.error('Failed to save unit preference:', error);
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === 'miles' ? 'km' : 'miles';
    setUnit(newUnit);
  };

  return (
    <UnitContext.Provider value={{ unit, setUnit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
};