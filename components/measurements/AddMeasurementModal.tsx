import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMeasurements } from '@/context/MeasurementsContext';
import { BODY_PARTS, BodyPartId } from '@/types/measurements';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface AddMeasurementModalProps {
  visible: boolean;
  onClose: () => void;
  preselectedPartId?: BodyPartId | null;
}

export function AddMeasurementModal({
  visible,
  onClose,
  preselectedPartId = null,
}: AddMeasurementModalProps) {
  const { addMeasurement } = useMeasurements();
  const [bodyPartId, setBodyPartId] = useState<BodyPartId>(
    preselectedPartId || 'brazos'
  );
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (visible && preselectedPartId) setBodyPartId(preselectedPartId);
  }, [visible, preselectedPartId]);

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const resetForm = () => {
    setBodyPartId(preselectedPartId || 'brazos');
    setValue('');
    setNotes('');
  };

  const handleSave = () => {
    const num = parseFloat(value.replace(',', '.'));
    if (isNaN(num) || num <= 0) {
      Alert.alert('Valor inválido', 'Ingresa una medida en cm (número mayor que 0).');
      return;
    }
    addMeasurement(bodyPartId, num, undefined, notes.trim() || undefined);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText type="title">Nueva medición</ThemedText>
            <TouchableOpacity onPress={handleClose}>
              <IconSymbol name="xmark" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <ThemedText type="subtitle" style={styles.label}>
              Parte del cuerpo
            </ThemedText>
            <View style={styles.partsGrid}>
              {BODY_PARTS.map((part) => (
                <TouchableOpacity
                  key={part.id}
                  style={[
                    styles.partChip,
                    bodyPartId === part.id && { backgroundColor: tintColor + '30', borderColor: tintColor },
                  ]}
                  onPress={() => setBodyPartId(part.id)}>
                  <ThemedText
                    style={[
                      styles.partChipText,
                      bodyPartId === part.id && { color: tintColor, fontWeight: '600' },
                    ]}>
                    {part.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <ThemedText type="subtitle" style={styles.label}>
              Medida (cm)
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: iconColor }]}
              placeholder="Ej: 38.5"
              placeholderTextColor={iconColor}
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
            />

            <ThemedText type="subtitle" style={styles.label}>
              Notas (opcional)
            </ThemedText>
            <TextInput
              style={[styles.input, styles.textArea, { color: textColor, borderColor: iconColor }]}
              placeholder="Ej: después del entrenamiento"
              placeholderTextColor={iconColor}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: tintColor }]}
              onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>Guardar medición</ThemedText>
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
  },
  partsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  partChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  partChipText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
