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

  useEffect(() => {
    const today = new Date().toLocaleDateString();
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
        console.error('Failed to fetch daily goal', error);
      }
    };

    getDailyGoal();
  }, []);

  useEffect(() => {
    const checkDateAndReset = async () => {
      if (!dailyGoal) return;

      const today = new Date().toLocaleDateString();
      const storedDate = await AsyncStorage.getItem('lastTrackedDate');

      if (storedDate !== today) {
        await AsyncStorage.setItem('lastTrackedDate', today);
        await AsyncStorage.setItem('currentIntake', '0');
        await AsyncStorage.setItem('remainingWater', dailyGoal.toString());

        setCurrentIntake(0);
        setRemainingWater(dailyGoal);
        progressBarWidth.setValue(0);
      } else {
        const storedIntake = await AsyncStorage.getItem('currentIntake');
        const storedRemaining = await AsyncStorage.getItem('remainingWater');

        if (storedIntake !== null) {
          const intake = parseFloat(storedIntake);
          setCurrentIntake(intake);

          Animated.timing(progressBarWidth, {
            toValue: (intake / dailyGoal) * 100,
            duration: 500,
            useNativeDriver: false,
          }).start();
        }

        if (storedRemaining !== null) {
          setRemainingWater(parseFloat(storedRemaining));
        }
      }
    };

    checkDateAndReset();
  }, [dailyGoal]);

  const handleDrinkWater = (amount: number) => {
    if (dailyGoal !== null) {
      const newIntake = currentIntake + amount;
      setCurrentIntake(newIntake);

      const newRemaining = dailyGoal - newIntake;
      const safeRemaining = newRemaining >= 0 ? newRemaining : 0;
      setRemainingWater(safeRemaining);

      Animated.timing(progressBarWidth, {
        toValue: (newIntake / dailyGoal) * 100,
        duration: 500,
        useNativeDriver: false,
      }).start();

      AsyncStorage.setItem('currentIntake', newIntake.toString()).catch((error) =>
        console.error('Failed to save current intake', error),
      );

      AsyncStorage.setItem('remainingWater', safeRemaining.toString()).catch((error) =>
        console.error('Failed to save remaining water', error),
      );
    }
  };

  const getMotivationalMessage = () => {
    if (dailyGoal === null) return '';
    if (currentIntake >= dailyGoal) {
      return '🎉 Congrats! You\'ve reached your daily goal! Keep hydrating!';
    } else if (currentIntake > dailyGoal * 0.75) {
      return '💧 Almost there! You\'re doing great, just a little more!';
    } else if (currentIntake > dailyGoal * 0.5) {
      return '💪 You\'re halfway there! Keep going!';
    } else if (currentIntake > dailyGoal * 0.25) {
      return '🧑‍💼 Keep it up! You\'re making progress!';
    } else {
      return '🌟 Start strong! Hydrate and feel energized!';
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
              You've drunk {currentIntake.toFixed(2)} mL today
            </Text>
            <Text style={styles.remainingText}>
              {remainingWater > 0
                ? `You need ${remainingWater.toFixed(2)} mL more to reach your goal`
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
            <Text style={styles.messageText}>Set your daily water goal in Settings</Text>
            <TouchableOpacity
              style={[styles.button, { width: '60%', backgroundColor: '#ff5722' }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.buttonText}>Go to Settings</Text>
            </TouchableOpacity>
          </View>
        )}
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
});

export default HomeScreen;
