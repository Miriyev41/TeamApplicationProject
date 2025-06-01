import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const unitOptions = ['ml', 'litres'];
const weightOptions = ['kg', 'lbs'];

export default function GeneralSettingsScreen() {
  const [unit, setUnit] = useState<string>('ml');
  const [weight, setWeight] = useState<string>('kg');
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const savedUnit = await AsyncStorage.getItem('unit');
      const savedWeight = await AsyncStorage.getItem('weight');
      if (savedUnit) setUnit(savedUnit);
      if (savedWeight) setWeight(savedWeight);
    };
    loadSettings();
  }, []);

  const updateUnit = async (selected: string) => {
    setUnit(selected);
    setUnitModalVisible(false);
    await AsyncStorage.setItem('unit', selected);
  };

  const updateWeight = async (selected: string) => {
    setWeight(selected);
    setWeightModalVisible(false);
    await AsyncStorage.setItem('weight', selected);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>General Settings</Text>

      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => setUnitModalVisible(true)}
      >
        <Text style={styles.settingLabel}>Units</Text>
        <Text style={styles.settingValue}>{unit}, {weight}</Text>
      </TouchableOpacity>

      <Modal visible={unitModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={unitOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => updateUnit(item)}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => setWeightModalVisible(true)}
      >
        <Text style={styles.settingLabel}>Weight Unit</Text>
        <Text style={styles.settingValue}>{weight}</Text>
      </TouchableOpacity>

      <Modal visible={weightModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={weightOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => updateWeight(item)}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    paddingVertical: 20,
  },
  modalItem: {
    padding: 15,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
  },
});
