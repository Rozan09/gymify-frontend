import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContextProvider';
import axios from 'axios';

// Create and export the context
export const FitnessDataContext = createContext(null);

// Create and export a custom hook for using the context
export const useFitnessData = () => {
  const context = useContext(FitnessDataContext);
  if (!context) {
    throw new Error('useFitnessData must be used within a FitnessDataProvider');
  }
  return context;
};

// Export the provider component as default
export default function FitnessDataProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [fitnessData, setFitnessData] = useState({
    weight: '',
    height: '',
    bmi: '',
    bmiCategory: '',
    dailyCalories: '',
    weightUnit: 'kg',
    heightUnit: 'cm',
    goals: {
      targetWeight: '',
      targetDate: '',
      progress: 0
    }
  });

  const updateFitnessData = async (newData) => {
    try {
      const tokenToUse = token || localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/api/v1/users/fitness-data', newData, {
        headers: {
          'Authorization': `Bearer ${tokenToUse}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setFitnessData(prev => ({ ...prev, ...newData }));
        localStorage.setItem('fitnessData', JSON.stringify({ ...fitnessData, ...newData }));
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (err) {
      console.error('Error updating fitness data:', err);
      return { success: false, error: err.response?.data?.message || 'Error updating fitness data' };
    }
  };

  const calculateBMI = (weight, height, weightUnit = 'kg', heightUnit = 'cm') => {
    let w = parseFloat(weight);
    let h = parseFloat(height);

    // Convert to metric if necessary
    if (weightUnit === 'lbs') w *= 0.453592;
    if (heightUnit === 'in') h *= 2.54;

    // Convert height to meters
    h = h / 100;

    const bmi = w / (h * h);
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obese';

    return {
      bmi: bmi.toFixed(1),
      category
    };
  };

  const calculateDailyCalories = (weight, height, age, gender, activity, weightUnit = 'kg', heightUnit = 'cm') => {
    let w = parseFloat(weight);
    let h = parseFloat(height);
    const a = parseFloat(age);
    const act = parseFloat(activity);

    if (weightUnit === 'lbs') w *= 0.453592;
    if (heightUnit === 'in') h *= 2.54;

    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    return (bmr * act).toFixed(0);
  };

  useEffect(() => {
    // Load fitness data from localStorage on mount
    const savedData = localStorage.getItem('fitnessData');
    if (savedData) {
      setFitnessData(JSON.parse(savedData));
    }
  }, []);

  const value = {
    fitnessData,
    setFitnessData,
    updateFitnessData,
    calculateBMI,
    calculateDailyCalories
  };

  return (
    <FitnessDataContext.Provider value={value}>
      {children}
    </FitnessDataContext.Provider>
  );
} 