import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWorkout } from '@/context/WorkoutContext';
import { Exercise } from '@/types/workout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddExerciseModal({ visible, onClose }: AddExerciseModalProps) {
  const { exercises, addExerciseToWorkout } = useWorkout();
  const [searchQuery, setSearchQuery] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectExercise = (exercise: Exercise) => {
    addExerciseToWorkout(exercise);
    onClose();
    setSearchQuery('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText type="title">Agregar Ejercicio</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.searchInput, { color: textColor, borderColor: iconColor }]}
            placeholder="Buscar ejercicio..."
            placeholderTextColor={iconColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.exerciseItem, { borderBottomColor: iconColor }]}
                onPress={() => handleSelectExercise(item)}>
                <ThemedText style={styles.exerciseItemText}>{item.name}</ThemedText>
                {item.category && (
                  <ThemedText style={[styles.categoryText, { color: tintColor }]}>
                    {item.category}
                  </ThemedText>
                )}
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseItemText: {
    fontSize: 16,
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
