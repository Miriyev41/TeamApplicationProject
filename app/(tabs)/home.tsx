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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [dailyGoal, setDailyGoal] = useState<number | null>(null); 
  const [currentIntake, setCurrentIntake] = useState<number>(0);
  const [remainingWater, setRemainingWater] = useState<number>(0);
  const [progressBarWidth] = useState(new Animated.Value(0));
  const [currentDate, setCurrentDate] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setCurrentDate(today);

    const loadData = async () => {
      try {
        const storedGoal = await AsyncStorage.getItem('dailyGoal');
        const storedDate = await AsyncStorage.getItem('lastTrackedDate');
        const todayDate = new Date().toLocaleDateString();

        if (storedGoal !== null) {
          const goalLiters = parseFloat(storedGoal);
          setDailyGoal(goalLiters);

          const goalInMl = goalLiters * 1000;

          if (storedDate !== todayDate) {
            await AsyncStorage.setItem('lastTrackedDate', todayDate);
            await AsyncStorage.setItem('currentIntake', '0');
            await AsyncStorage.setItem('remainingWater', goalInMl.toString());

            setCurrentIntake(0);
            setRemainingWater(goalInMl);
            progressBarWidth.setValue(0);
          } else {
            const storedIntake = await AsyncStorage.getItem('currentIntake');
            const intake = storedIntake ? parseFloat(storedIntake) : 0;

            const storedRemaining = await AsyncStorage.getItem('remainingWater');
            const remaining = storedRemaining
              ? parseFloat(storedRemaining)
              : goalInMl - intake;

            setCurrentIntake(intake);
            setRemainingWater(remaining);

            const progressPercent = (intake / goalInMl) * 100;
            progressBarWidth.setValue(progressPercent);
          }
        } else {
          setDailyGoal(null);
        }
      } catch (error) {
        console.error('Failed to load daily goal or intake', error);
      }
    };

    loadData();

    const countdownInterval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}h ${minutes
          .toString()
          .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s left to hydrate`
      );
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handleDrinkWater = (amount: number) => {
  if (dailyGoal !== null) {
    const goalInMl = dailyGoal * 1000;
    let newIntake = currentIntake + amount;

    setCurrentIntake(newIntake);
    const newRemaining = goalInMl - newIntake;
    const safeRemaining = newRemaining >= 0 ? newRemaining : 0;
    setRemainingWater(safeRemaining);

    Animated.timing(progressBarWidth, {
      toValue: (newIntake / goalInMl) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();

    AsyncStorage.setItem('currentIntake', newIntake.toString()).catch((error) =>
      console.error('Failed to save current intake', error)
    );
    AsyncStorage.setItem('remainingWater', safeRemaining.toString()).catch((error) =>
      console.error('Failed to save remaining water', error)
    );
  }
};

  const getMotivationalMessage = () => {
    if (dailyGoal === null) return '';
    if (currentIntake >= dailyGoal * 1000) {
      return "🎉 Congrats! You've reached your daily goal! Keep hydrating!";
    } else if (currentIntake > dailyGoal * 1000 * 0.75) {
      return "💧 Almost there! You're doing great, just a little more!";
    } else if (currentIntake > dailyGoal * 1000 * 0.5) {
      return "💪 You're halfway there! Keep going!";
    } else if (currentIntake > dailyGoal * 1000 * 0.25) {
      return "🧑‍💼 Keep it up! You're making progress!";
    } else {
      return "🌟 Start strong! Hydrate and feel energized!";
    }
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

        {/* Countdown Timer */}
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
    height: '100%',
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
    textAlign: 'right',
  },
  motivationalText: {
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'italic',
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
