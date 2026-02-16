import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWorkout } from '@/context/WorkoutContext';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { AddExerciseModal } from '@/components/workout/AddExerciseModal';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function WorkoutScreen() {
  const { currentWorkout, startWorkout, endWorkout } = useWorkout();
  const [showAddExercise, setShowAddExercise] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const handleStartWorkout = () => {
    startWorkout();
  };

  const handleEndWorkout = () => {
    if (!currentWorkout || currentWorkout.exercises.length === 0) {
      Alert.alert('Sin ejercicios', 'Agrega al menos un ejercicio antes de finalizar');
      return;
    }

    Alert.alert(
      'Finalizar entrenamiento',
      '¿Estás seguro de finalizar este entrenamiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: () => {
            endWorkout();
            Alert.alert('¡Entrenamiento completado!', 'Tu entrenamiento ha sido guardado');
          },
        },
      ]
    );
  };

  if (!currentWorkout) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyContainer}>
          <IconSymbol name="dumbbell" size={80} color={tintColor} />
          <ThemedText type="title" style={styles.emptyTitle}>
            ¡Comienza tu entrenamiento!
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            Presiona el botón para iniciar una nueva sesión de entrenamiento
          </ThemedText>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: tintColor }]}
            onPress={handleStartWorkout}>
            <ThemedText style={styles.startButtonText}>Iniciar Entrenamiento</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Entrenamiento Activo</ThemedText>
          <ThemedText style={styles.dateText}>
            {new Date(currentWorkout.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.endButton, { backgroundColor: '#FF3B30' }]}
          onPress={handleEndWorkout}>
          <ThemedText style={styles.endButtonText}>Finalizar</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {currentWorkout.exercises.length === 0 ? (
          <View style={styles.emptyExercisesContainer}>
            <ThemedText style={styles.emptyExercisesText}>
              No hay ejercicios aún. Agrega tu primer ejercicio para comenzar.
            </ThemedText>
          </View>
        ) : (
          currentWorkout.exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: tintColor }]}
        onPress={() => setShowAddExercise(true)}>
        <IconSymbol name="plus" size={24} color="#fff" />
        <ThemedText style={styles.addButtonText}>Agregar Ejercicio</ThemedText>
      </TouchableOpacity>

      <AddExerciseModal
        visible={showAddExercise}
        onClose={() => setShowAddExercise(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dateText: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  endButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  endButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyExercisesContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyExercisesText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
