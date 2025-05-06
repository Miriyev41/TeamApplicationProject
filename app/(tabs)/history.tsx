import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState<any[]>([]);

  // Fetch history from AsyncStorage
  const getHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('waterHistory');
      if (storedHistory !== null) {
        setHistory(JSON.parse(storedHistory)); // Parse the history array if it exists
      }
    } catch (error) {
      console.error("Failed to fetch water history", error);
    }
  };

  // Call the function when the component mounts to load the history
  useEffect(() => {
    getHistory();
  }, []);

  // Render each day's water intake history
  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.historyItem}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={styles.historyIntake}>Water Intake: {item.intake} mL</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Intake History</Text>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.date}
        />
      ) : (
        <Text style={styles.noHistoryText}>No history available yet!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  historyItem: {
    backgroundColor: '#e1f5fe',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyIntake: {
    fontSize: 16,
    color: '#333',
  },
  noHistoryText: {
    fontSize: 18,
    color: '#ff5722',
    marginTop: 20,
  },
});

export default HistoryScreen;
