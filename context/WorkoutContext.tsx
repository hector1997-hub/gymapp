import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession, ExerciseInWorkout, Exercise, Set } from '@/types/workout';

interface WorkoutContextType {
  currentWorkout: WorkoutSession | null;
  workoutHistory: WorkoutSession[];
  exercises: Exercise[];
  startWorkout: () => void;
  endWorkout: () => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  addSetToExercise: (exerciseInWorkoutId: string, reps: number, weight: number) => void;
  updateSet: (exerciseInWorkoutId: string, setId: string, reps: number, weight: number) => void;
  toggleSetCompleted: (exerciseInWorkoutId: string, setId: string) => void;
  removeExerciseFromWorkout: (exerciseInWorkoutId: string) => void;
  loadWorkoutHistory: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WORKOUT_HISTORY: '@gymapp:workout_history',
  CURRENT_WORKOUT: '@gymapp:current_workout',
  EXERCISES: '@gymapp:exercises',
};

// Ejercicios predefinidos
const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Press de banca', category: 'pecho' },
  { id: '2', name: 'Sentadillas', category: 'piernas' },
  { id: '3', name: 'Peso muerto', category: 'piernas' },
  { id: '4', name: 'Press militar', category: 'hombros' },
  { id: '5', name: 'Remo con barra', category: 'espalda' },
  { id: '6', name: 'Curl de bíceps', category: 'brazos' },
  { id: '7', name: 'Tríceps en polea', category: 'brazos' },
  { id: '8', name: 'Dominadas', category: 'espalda' },
  { id: '9', name: 'Press inclinado', category: 'pecho' },
  { id: '10', name: 'Prensa de piernas', category: 'piernas' },
];

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);

  // Cargar datos del almacenamiento
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar historial
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
      if (historyData) {
        setWorkoutHistory(JSON.parse(historyData));
      }

      // Cargar entrenamiento actual
      const currentData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
      if (currentData) {
        setCurrentWorkout(JSON.parse(currentData));
      }

      // Cargar ejercicios personalizados
      const exercisesData = await AsyncStorage.getItem(STORAGE_KEYS.EXERCISES);
      if (exercisesData) {
        const customExercises = JSON.parse(exercisesData);
        setExercises([...DEFAULT_EXERCISES, ...customExercises]);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const saveWorkoutHistory = async (history: WorkoutSession[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error guardando historial:', error);
    }
  };

  const saveCurrentWorkout = async (workout: WorkoutSession | null) => {
    try {
      if (workout) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
      }
    } catch (error) {
      console.error('Error guardando entrenamiento actual:', error);
    }
  };

  const startWorkout = () => {
    const newWorkout: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: [],
    };
    setCurrentWorkout(newWorkout);
    saveCurrentWorkout(newWorkout);
  };

  const endWorkout = () => {
    if (currentWorkout) {
      const updatedHistory = [currentWorkout, ...workoutHistory];
      setWorkoutHistory(updatedHistory);
      setCurrentWorkout(null);
      saveWorkoutHistory(updatedHistory);
      saveCurrentWorkout(null);
    }
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    if (!currentWorkout) return;

    const exerciseInWorkout: ExerciseInWorkout = {
      id: Date.now().toString(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [],
    };

    const updatedWorkout = {
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, exerciseInWorkout],
    };

    setCurrentWorkout(updatedWorkout);
    saveCurrentWorkout(updatedWorkout);
  };

  const addSetToExercise = (exerciseInWorkoutId: string, reps: number, weight: number) => {
    if (!currentWorkout) return;

    const newSet: Set = {
      id: Date.now().toString(),
      reps,
      weight,
      completed: false,
    };

    const updatedExercises = currentWorkout.exercises.map((ex) =>
      ex.id === exerciseInWorkoutId
        ? { ...ex, sets: [...ex.sets, newSet] }
        : ex
    );

    const updatedWorkout = {
      ...currentWorkout,
      exercises: updatedExercises,
    };

    setCurrentWorkout(updatedWorkout);
    saveCurrentWorkout(updatedWorkout);
  };

  const updateSet = (exerciseInWorkoutId: string, setId: string, reps: number, weight: number) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map((ex) =>
      ex.id === exerciseInWorkoutId
        ? {
            ...ex,
            sets: ex.sets.map((set) =>
              set.id === setId ? { ...set, reps, weight } : set
            ),
          }
        : ex
    );

    const updatedWorkout = {
      ...currentWorkout,
      exercises: updatedExercises,
    };

    setCurrentWorkout(updatedWorkout);
    saveCurrentWorkout(updatedWorkout);
  };

  const toggleSetCompleted = (exerciseInWorkoutId: string, setId: string) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map((ex) =>
      ex.id === exerciseInWorkoutId
        ? {
            ...ex,
            sets: ex.sets.map((set) =>
              set.id === setId ? { ...set, completed: !set.completed } : set
            ),
          }
        : ex
    );

    const updatedWorkout = {
      ...currentWorkout,
      exercises: updatedExercises,
    };

    setCurrentWorkout(updatedWorkout);
    saveCurrentWorkout(updatedWorkout);
  };

  const removeExerciseFromWorkout = (exerciseInWorkoutId: string) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.filter(
      (ex) => ex.id !== exerciseInWorkoutId
    );

    const updatedWorkout = {
      ...currentWorkout,
      exercises: updatedExercises,
    };

    setCurrentWorkout(updatedWorkout);
    saveCurrentWorkout(updatedWorkout);
  };

  const loadWorkoutHistory = async () => {
    await loadData();
  };

  return (
    <WorkoutContext.Provider
      value={{
        currentWorkout,
        workoutHistory,
        exercises,
        startWorkout,
        endWorkout,
        addExerciseToWorkout,
        addSetToExercise,
        updateSet,
        toggleSetCompleted,
        removeExerciseFromWorkout,
        loadWorkoutHistory,
      }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout debe usarse dentro de WorkoutProvider');
  }
  return context;
}
