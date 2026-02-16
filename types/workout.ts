// Tipos para la app de gimnasio

export interface Exercise {
  id: string;
  name: string;
  category?: string; // 'pecho', 'espalda', 'piernas', etc.
}

export interface Set {
  id: string;
  reps: number;
  weight: number; // en kg
  completed: boolean;
}

export interface ExerciseInWorkout {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: Set[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string
  exercises: ExerciseInWorkout[];
  duration?: number; // en minutos
  notes?: string;
}
