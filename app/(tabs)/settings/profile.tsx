import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const ProfileScreen = () => {
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<
    'Sedentary' | 'Light Activity' | 'Moderately Active' | 'Very Active' | 'Extremely Active'
  >('Sedentary');
  const [climate, setClimate] = useState<'Tropical' | 'Temperate' | 'Cold'>('Temperate');
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);

  useEffect(() => {
    const loadDailyGoal = async () => {
      try {
        const storedGoal = await AsyncStorage.getItem('dailyGoal');
        if (storedGoal) {
          setDailyGoal(parseInt(storedGoal));
        }
      } catch (e) {
        console.error('Failed to load daily goal', e);
      }
    };

    loadDailyGoal();
  }, []);

  const calculateWaterIntake = async () => {
    if (!weight) {
      Alert.alert('Input Needed', 'Please enter your weight.');
      return;
    }

    const weightInKg = parseFloat(weight);
    if (isNaN(weightInKg) || weightInKg <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid weight in kg.');
      return;
    }

    const baseMlPerKg = 35;
    let intakeMl = weightInKg * baseMlPerKg;

    const activityMultipliers: Record<string, number> = {
      Sedentary: 1,
      'Light Activity': 1.35,
      'Moderately Active': 1.55,
      'Very Active': 1.7,
      'Extremely Active': 1.9,
    };
    intakeMl *= activityMultipliers[activityLevel];

    const climateMultipliers: Record<string, number> = {
      Tropical: 1.1,
      Temperate: 1,
      Cold: 0.9,
    };
    intakeMl *= climateMultipliers[climate];

    const intakeRoundedMl = Math.round(intakeMl);
    setDailyGoal(intakeRoundedMl);

    try {
      await AsyncStorage.setItem('dailyGoal', intakeRoundedMl.toString());
      Alert.alert('Goal Saved', `Daily water goal: ${intakeRoundedMl} mL`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save daily goal.');
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Set Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Activity Level</Text>
      <Picker
        selectedValue={activityLevel}
        style={styles.picker}
        onValueChange={(itemValue) => setActivityLevel(itemValue as typeof activityLevel)}
      >
        <Picker.Item label="Sedentary" value="Sedentary" />
        <Picker.Item label="Light Activity" value="Light Activity" />
        <Picker.Item label="Moderately Active" value="Moderately Active" />
        <Picker.Item label="Very Active" value="Very Active" />
        <Picker.Item label="Extremely Active" value="Extremely Active" />
      </Picker>

      <Text style={styles.label}>Climate</Text>
      <Picker
        selectedValue={climate}
        style={styles.picker}
        onValueChange={(itemValue) => setClimate(itemValue as typeof climate)}
      >
        <Picker.Item label="Tropical" value="Tropical" />
        <Picker.Item label="Temperate" value="Temperate" />
        <Picker.Item label="Cold" value="Cold" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={calculateWaterIntake}>
        <Text style={styles.buttonText}>Calculate Water Intake</Text>
      </TouchableOpacity>

      {dailyGoal !== null && (
        <Text style={styles.result}>💧 Daily Water Goal: {dailyGoal} mL</Text>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00796B',
  },
  input: {
    height: 50,
    borderColor: '#00796B',
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 10,
    color: '#00796B',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#00796B',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  result: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004D40',
    textAlign: 'center',
  },
});
