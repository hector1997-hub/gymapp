import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWorkout } from '@/context/WorkoutContext';
import { ExerciseInWorkout } from '@/types/workout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ExerciseCardProps {
  exercise: ExerciseInWorkout;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { addSetToExercise, updateSet, toggleSetCompleted, removeExerciseFromWorkout } = useWorkout();
  const [newReps, setNewReps] = useState('10');
  const [newWeight, setNewWeight] = useState('0');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const handleAddSet = () => {
    const reps = parseInt(newReps) || 0;
    const weight = parseFloat(newWeight) || 0;
    if (reps > 0) {
      addSetToExercise(exercise.id, reps, weight);
      setNewReps('10');
      setNewWeight('0');
    }
  };

  const handleDeleteExercise = () => {
    Alert.alert(
      'Eliminar ejercicio',
      `¿Estás seguro de eliminar ${exercise.exerciseName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeExerciseFromWorkout(exercise.id),
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.exerciseName}>
          {exercise.exerciseName}
        </ThemedText>
        <TouchableOpacity onPress={handleDeleteExercise}>
          <IconSymbol name="trash" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Lista de series */}
      {exercise.sets.length > 0 && (
        <View style={styles.setsContainer}>
          <View style={styles.setHeader}>
            <ThemedText style={styles.setHeaderText}>Series</ThemedText>
            <ThemedText style={styles.setHeaderText}>Reps</ThemedText>
            <ThemedText style={styles.setHeaderText}>Peso (kg)</ThemedText>
            <ThemedText style={styles.setHeaderText}>✓</ThemedText>
          </View>
          {exercise.sets.map((set, index) => (
            <View key={set.id} style={styles.setRow}>
              <ThemedText style={styles.setNumber}>{index + 1}</ThemedText>
              <ThemedText style={styles.setValue}>{set.reps}</ThemedText>
              <ThemedText style={styles.setValue}>{set.weight}</ThemedText>
              <TouchableOpacity
                onPress={() => toggleSetCompleted(exercise.id, set.id)}
                style={[
                  styles.checkbox,
                  set.completed && { backgroundColor: tintColor },
                ]}>
                {set.completed && <IconSymbol name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Agregar nueva serie */}
      <View style={styles.addSetContainer}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Reps"
          placeholderTextColor={iconColor}
          value={newReps}
          onChangeText={setNewReps}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Peso (kg)"
          placeholderTextColor={iconColor}
          value={newWeight}
          onChangeText={setNewWeight}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: tintColor }]}
          onPress={handleAddSet}>
          <ThemedText style={styles.addButtonText}>+ Serie</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    flex: 1,
  },
  setsContainer: {
    marginBottom: 12,
  },
  setHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  setHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  setNumber: {
    flex: 1,
    textAlign: 'center',
  },
  setValue: {
    flex: 1,
    textAlign: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  addSetContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
