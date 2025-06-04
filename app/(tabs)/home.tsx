import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenProps = {
  navigation: any;
};

const MS_IN_HOUR = 1000 * 60 * 60;
const MS_IN_MINUTE = 1000 * 60;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [remainingWater, setRemainingWater] = useState(0);
  const [progressBarWidth] = useState(new Animated.Value(0));
  const [currentDate, setCurrentDate] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Initialize current date string
    const today = new Date().toLocaleDateString();
    setCurrentDate(today);

    const loadData = async () => {
      try {
        const storedGoal = await AsyncStorage.getItem('dailyGoal');
        const storedDate = await AsyncStorage.getItem('lastTrackedDate');
        const todayDate = new Date().toLocaleDateString();

        if (storedGoal !== null) {
          const goalLiters = parseFloat(storedGoal);
          const goalInMl = Math.round(goalLiters * 1000);
          setDailyGoal(goalLiters);

          if (storedDate !== todayDate) {
            // Reset intake data for new day
            await AsyncStorage.setItem('lastTrackedDate', todayDate);
            await AsyncStorage.setItem('currentIntake', '0');
            await AsyncStorage.setItem('remainingWater', goalInMl.toString());

            setCurrentIntake(0);
            setRemainingWater(goalInMl);
            progressBarWidth.setValue(0);
          } else {
            // Load existing intake data for today
            const storedIntake = await AsyncStorage.getItem('currentIntake');
            const intake = storedIntake ? parseFloat(storedIntake) : 0;

            const remaining = Math.max(0, goalInMl - intake);

            setCurrentIntake(intake);
            setRemainingWater(remaining);

            // Set progress bar accordingly
            const progressPercent = (intake / goalInMl) * 100;
            progressBarWidth.setValue(progressPercent);
          }
        } else {
          setDailyGoal(null);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();

    // Countdown timer for time left to midnight
    const countdownInterval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / MS_IN_HOUR);
      const minutes = Math.floor((diff % MS_IN_HOUR) / MS_IN_MINUTE);
      const seconds = Math.floor((diff % MS_IN_MINUTE) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}h ${minutes
          .toString()
          .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s left to hydrate`
      );
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [progressBarWidth]);

  const handleDrinkWater = (amount: number) => {
    if (dailyGoal === null) return;

    const goalInMl = Math.round(dailyGoal);
    let newIntake = currentIntake + amount;

    if (newIntake > goalInMl) newIntake = goalInMl;

    const newRemaining = Math.max(0, goalInMl - newIntake);

    setCurrentIntake(newIntake);
    setRemainingWater(newRemaining);

    Animated.timing(progressBarWidth, {
      toValue: (newIntake / goalInMl) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();

    AsyncStorage.setItem('currentIntake', newIntake.toString()).catch(console.error);
    AsyncStorage.setItem('remainingWater', newRemaining.toString()).catch(console.error);
  };

  const getMotivationalMessage = () => {
    if (dailyGoal === null) return '';
    const goalInMl = dailyGoal;
    if (currentIntake >= goalInMl) return "🎉 Congrats! You've reached your daily goal!";
    if (currentIntake >= goalInMl * 0.75) return "💧 Almost there! Just a bit more!";
    if (currentIntake >= goalInMl * 0.5) return "💪 You're halfway there!";
    if (currentIntake >= goalInMl * 0.25) return "🧑‍💼 Good start! Keep going!";
    return "🌟 Stay hydrated and energized!";
  };

  return (
    <ImageBackground
      source={require('../../assets/images/home_background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.dateText}>{currentDate}</Text>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Water Reminder</Text>
        </View>

        <Text style={styles.motivationalText}>{getMotivationalMessage()}</Text>

        {dailyGoal !== null ? (
          <View style={styles.waterIntakeContainer}>
            <Text style={styles.intakeText}>
              You've drunk {currentIntake.toFixed(0)} mL today
            </Text>
            <Text style={styles.remainingText}>
              {remainingWater > 0
                ? `You need ${remainingWater.toFixed(0)} mL more to reach your goal`
                : "You've reached your daily goal!"}
            </Text>

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

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDrinkWater(250)}
              >
                <Text style={styles.buttonText}>Drink 250 mL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDrinkWater(500)}
              >
                <Text style={styles.buttonText}>Drink 500 mL</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.messageText}>
              Set your daily water goal in Settings
            </Text>
            <TouchableOpacity
              style={[styles.button, { width: '60%', backgroundColor: '#ff5722' }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.buttonText}>Go to Settings</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{timeLeft}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  titleContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 20,
  },
  dateText: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288D1',
  },
  motivationalText: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  waterIntakeContainer: {
    marginBottom: 30,
    padding: 25,
    backgroundColor: '#7FFFD4',
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
    color: '#0277BD',
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
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
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
  countdownContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  countdownText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
