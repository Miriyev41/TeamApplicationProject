import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }: any) => {
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('Sedentary');
  const [climate, setClimate] = useState<string>('Temperate');
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [isProfileVisible, setProfileVisible] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isLanguagesVisible, setLanguagesVisible] = useState<boolean>(false);
  

  // Function to calculate water intake
  const calculateWaterIntake = () => {
    if (!weight) {
      alert('Please enter your weight.');
      return;
    }

    let weightInKg = parseFloat(weight);
    if (isNaN(weightInKg) || weightInKg <= 0) {
      alert('Invalid weight. Please enter a positive number.');
      return;
    }

    let waterIntake = weightInKg * 35;

    const activityMultipliers: { [key: string]: number } = {
      Sedentary: 1,
      'Light Activity': 1.35,
      'Moderately Active': 1.55,
      'Very Active': 1.7,
      'Extremely Active': 1.9,
    };
    waterIntake *= activityMultipliers[activityLevel];

    const climateMultipliers: { [key: string]: number } = {
      Tropical: 1.1,
      Temperate: 1,
      Cold: 0.9,
    };
    waterIntake *= climateMultipliers[climate];

    setDailyGoal(waterIntake);
    AsyncStorage.setItem('dailyGoal', waterIntake.toString());
    alert(`Your daily water intake goal is: ${waterIntake.toFixed(2)} mL`);
  };

  return (
    <ScrollView style={styles.container}>
      

      {/* Profile Section */}
      <TouchableOpacity onPress={() => setProfileVisible(!isProfileVisible)}>
        <Text style={styles.sectionTitle}>Profile</Text>
      </TouchableOpacity>

      {isProfileVisible && (
        <View style={styles.sectionContent}>
          <Text style={styles.title}>Set Your Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={styles.label}>Select Activity Level</Text>
          <Picker
            selectedValue={activityLevel}
            style={styles.picker}
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
          >
            <Picker.Item label="Sedentary" value="Sedentary" />
            <Picker.Item label="Light Activity" value="Light Activity" />
            <Picker.Item label="Moderately Active" value="Moderately Active" />
            <Picker.Item label="Very Active" value="Very Active" />
            <Picker.Item label="Extremely Active" value="Extremely Active" />
          </Picker>

          <Text style={styles.label}>Select Climate</Text>
          <Picker
            selectedValue={climate}
            style={styles.picker}
            onValueChange={(itemValue) => setClimate(itemValue)}
          >
            <Picker.Item label="Tropical" value="Tropical" />
            <Picker.Item label="Temperate" value="Temperate" />
            <Picker.Item label="Cold" value="Cold" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={calculateWaterIntake}>
            <Text style={styles.buttonText}>Calculate Water Intake</Text>
          </TouchableOpacity>

          {dailyGoal !== null && (
            <Text style={styles.result}>Daily Water Goal: {dailyGoal.toFixed(2)} mL</Text>
          )}
        </View>
      )}
      <TouchableOpacity onPress={() => setLanguagesVisible(!isLanguagesVisible)}>
        <Text style={styles.sectionTitle}>Languages</Text>
      </TouchableOpacity>
      {isLanguagesVisible && (
        <View style={styles.sectionContent}>
          <Text style={styles.label}>Select Language</Text>
          <Picker
            selectedValue={selectedLanguage}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          >
            <Picker.Item label="English" value="English" />
            <Picker.Item label="Spanish" value="Spanish" />
            <Picker.Item label="German" value="German" />
            <Picker.Item label="French" value="French" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={() => alert(`Selected language: ${selectedLanguage}`)}>
            <Text style={styles.buttonText}>Save Language Preference</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00796b',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#00796b',
  },
  sectionContent: {
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  input: {
    height: 45,
    borderColor: '#00796b',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#00796b',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  result: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004d40',
  },
});

export default SettingsScreen;
