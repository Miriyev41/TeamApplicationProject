import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [currentIntake, setCurrentIntake] = useState<number>(0); // Track the water the user has consumed
  const [remainingWater, setRemainingWater] = useState<number>(0); // Track remaining water
  const [progressBarWidth] = useState(new Animated.Value(0)); // For the progress bar animation
  const [currentDate, setCurrentDate] = useState<string>(''); // Store current date

  // Fetch the current date
  useEffect(() => {
    const today = new Date().toLocaleDateString(); // Format date as "MM/DD/YYYY"
    setCurrentDate(today);

    const getDailyGoal = async () => {
      try {
        const storedGoal = await AsyncStorage.getItem('dailyGoal');
        if (storedGoal !== null) {
          const goal = parseFloat(storedGoal);
          setDailyGoal(goal);
          setRemainingWater(goal);
        }
      } catch (error) {
        console.error("Failed to fetch daily goal", error);
      }
    };

    getDailyGoal();
  }, []);

  // Function to simulate drinking water and update the progress
  const handleDrinkWater = (amount: number) => {
    if (dailyGoal !== null) {
      const newIntake = currentIntake + amount;
      setCurrentIntake(newIntake);

      // Calculate remaining water
      const newRemaining = dailyGoal - newIntake;
      setRemainingWater(newRemaining >= 0 ? newRemaining : 0);

      // Animate the progress bar
      Animated.timing(progressBarWidth, {
        toValue: (newIntake / dailyGoal) * 100, // Convert to percentage
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  // Generate a motivational message based on the user's progress
  const getMotivationalMessage = () => {
    if (currentIntake >= dailyGoal!) {
      return "🎉 Congrats! You've reached your daily goal! Keep hydrating!";
    } else if (currentIntake > dailyGoal! * 0.75) {
      return "💧 Almost there! You're doing great, just a little more!";
    } else if (currentIntake > dailyGoal! * 0.5) {
      return "💪 You're halfway there! Keep going!";
    } else if (currentIntake > dailyGoal! * 0.25) {
      return "🧑‍💼 Keep it up! You're making progress!";
    } else {
      return "🌟 Start strong! Hydrate and feel energized!";
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/home_background.jpg')} // Ensure this is the correct path and image
      style={styles.background} // Full screen background
      resizeMode="cover"
    >
      {/* Full screen background now covers the entire screen */}
      <View style={styles.container}>
        {/* Current Date Display */}
        <Text style={styles.dateText}>{currentDate}</Text>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Water Reminder</Text>
        </View>

        {/* Motivational Message */}
        <Text style={styles.motivationalText}>{getMotivationalMessage()}</Text>

        {dailyGoal !== null ? (
          <View style={styles.waterIntakeContainer}>
            <Text style={styles.intakeText}>
              You've drunk {currentIntake.toFixed(2)} mL today
            </Text>
            <Text style={styles.remainingText}>
              {remainingWater > 0
                ? `You need ${remainingWater.toFixed(2)} mL more to reach your goal`
                : "You've reached your daily goal!"}
            </Text>

            {/* Progress bar */}
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>

            {/* Buttons to add water */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDrinkWater(250)} // Add 250 mL when button is pressed
              >
                <Text style={styles.buttonText}>Drink 250 mL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDrinkWater(500)} // Add 500 mL when button is pressed
              >
                <Text style={styles.buttonText}>Drink 500 mL</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.messageText}>Set your daily water goal in Settings</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Full screen background
    justifyContent: 'flex-start', // Start from the top of the screen
    alignItems: 'center', // Center horizontally
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    marginTop: 40, // Add some margin to push the title down
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E88E5', // Blue color for the title
    marginBottom: 20,
  },
  dateText: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288D1', // Blue color for date
    textAlign: 'right',
  },
  motivationalText: {
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'italic',
    color: '#4CAF50', // Green text for motivation
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  waterIntakeContainer: {
    marginBottom: 30,
    padding: 25,
    backgroundColor: '#7FFFD4', // Light blue to match Settings design
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  intakeText: {
    fontSize: 20,
    marginBottom: 15,
    color: '#0277BD', // Dark blue color for intake info
  },
  remainingText: {
    fontSize: 18,
    color: '#0277BD',
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 20,
    width: '100%',
    backgroundColor: '#E1F5FE',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50', // Green color for the progress bar
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#1E88E5', // Blue color for buttons
    padding: 15,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3, // Add elevation for a shadow effect
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  messageText: {
    fontSize: 18,
    color: '#ff5722',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
