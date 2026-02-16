import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWorkout } from '@/context/WorkoutContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HistoryScreen() {
  const { workoutHistory, loadWorkoutHistory } = useWorkout();
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  const getTotalExercises = (workout: typeof workoutHistory[0]) => {
    return workout.exercises.length;
  };

  const getTotalSets = (workout: typeof workoutHistory[0]) => {
    return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Historial</ThemedText>
        <ThemedText style={styles.subtitle}>
          {workoutHistory.length} {workoutHistory.length === 1 ? 'entrenamiento' : 'entrenamientos'}
        </ThemedText>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {workoutHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol name="calendar" size={80} color={iconColor} />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No hay entrenamientos
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Comienza un entrenamiento para verlo aquí
            </ThemedText>
          </View>
        ) : (
          workoutHistory.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutHeaderLeft}>
                  <ThemedText type="subtitle">{formatDate(workout.date)}</ThemedText>
                  <ThemedText style={styles.workoutTime}>{formatTime(workout.date)}</ThemedText>
                </View>
                <View style={[styles.badge, { backgroundColor: tintColor + '20' }]}>
                  <ThemedText style={[styles.badgeText, { color: tintColor }]}>
                    {getTotalExercises(workout)} ejercicios
                  </ThemedText>
                </View>
              </View>

              <View style={styles.workoutStats}>
                <View style={styles.statItem}>
                  <IconSymbol name="figure.strengthtraining.traditional" size={20} color={iconColor} />
                  <ThemedText style={styles.statText}>{getTotalExercises(workout)}</ThemedText>
                  <ThemedText style={styles.statLabel}>Ejercicios</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <IconSymbol name="repeat" size={20} color={iconColor} />
                  <ThemedText style={styles.statText}>{getTotalSets(workout)}</ThemedText>
                  <ThemedText style={styles.statLabel}>Series</ThemedText>
                </View>
              </View>

              <View style={styles.exercisesList}>
                {workout.exercises.map((exercise, index) => (
                  <View key={exercise.id} style={styles.exerciseItem}>
                    <ThemedText style={styles.exerciseName}>{exercise.exerciseName}</ThemedText>
                    <ThemedText style={styles.exerciseSets}>
                      {exercise.sets.length} {exercise.sets.length === 1 ? 'serie' : 'series'}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  workoutCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutHeaderLeft: {
    flex: 1,
  },
  workoutTime: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.7,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 20,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  exercisesList: {
    gap: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exerciseName: {
    flex: 1,
  },
  exerciseSets: {
    fontSize: 14,
    opacity: 0.7,
  },
});
