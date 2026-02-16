import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMeasurements } from '@/context/MeasurementsContext';
import { BODY_PARTS, BodyPartId } from '@/types/measurements';
import { AddMeasurementModal } from '@/components/measurements/AddMeasurementModal';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function MeasurementsScreen() {
  const { measurements, getMeasurementsByPart, deleteMeasurement, loadMeasurements } =
    useMeasurements();
  const [modalVisible, setModalVisible] = useState(false);
  const [preselectedPartId, setPreselectedPartId] = useState<BodyPartId | null>(null);
  const [expandedPart, setExpandedPart] = useState<BodyPartId | null>(null);
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    loadMeasurements();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar medición', '¿Eliminar esta medición?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteMeasurement(id) },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Mediciones</ThemedText>
          <ThemedText style={styles.subtitle}>
            Registra y revisa el avance de tu cuerpo (cm)
          </ThemedText>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {BODY_PARTS.map((part) => {
          const partMeasurements = getMeasurementsByPart(part.id);
          const latest = partMeasurements[0];
          const isExpanded = expandedPart === part.id;

          return (
            <View key={part.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpandedPart(isExpanded ? null : part.id)}
                activeOpacity={0.7}>
                <View style={styles.cardHeaderLeft}>
                  <ThemedText type="subtitle">{part.name}</ThemedText>
                  {latest ? (
                    <ThemedText style={[styles.latestValue, { color: tintColor }]}>
                      Última: {latest.value} cm
                    </ThemedText>
                  ) : (
                    <ThemedText style={styles.noData}>Sin registros</ThemedText>
                  )}
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={22}
                  color={iconColor}
                  style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.historyList}>
                  {partMeasurements.length === 0 ? (
                    <ThemedText style={styles.emptyHistory}>
                      Aún no hay mediciones. Agrega la primera.
                    </ThemedText>
                  ) : (
                    partMeasurements.map((m) => (
                      <View key={m.id} style={styles.historyRow}>
                        <View style={styles.historyRowLeft}>
                          <ThemedText style={styles.historyValue}>{m.value} cm</ThemedText>
                          <ThemedText style={styles.historyDate}>{formatDate(m.date)}</ThemedText>
                          {m.notes ? (
                            <ThemedText style={styles.historyNotes} numberOfLines={1}>
                              {m.notes}
                            </ThemedText>
                          ) : null}
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDelete(m.id)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                          <IconSymbol name="trash" size={20} color={iconColor} />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                  <TouchableOpacity
                    style={[styles.addInCard, { borderColor: tintColor }]}
                    onPress={() => {
                      setPreselectedPartId(part.id);
                      setModalVisible(true);
                      setExpandedPart(null);
                    }}>
                    <IconSymbol name="plus" size={18} color={tintColor} />
                    <ThemedText style={[styles.addInCardText, { color: tintColor }]}>
                      Agregar {part.name}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tintColor }]}
        onPress={() => {
          setPreselectedPartId(null);
          setModalVisible(true);
        }}>
        <IconSymbol name="plus" size={26} color="#fff" />
        <ThemedText style={styles.fabText}>Nueva medición</ThemedText>
      </TouchableOpacity>

      <AddMeasurementModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setPreselectedPartId(null);
        }}
        preselectedPartId={preselectedPartId}
      />
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
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  latestValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
  },
  noData: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.6,
  },
  historyList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  emptyHistory: {
    paddingVertical: 16,
    opacity: 0.7,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyRowLeft: {
    flex: 1,
  },
  historyValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.7,
  },
  historyNotes: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.6,
  },
  addInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  addInCardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
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
  fabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
