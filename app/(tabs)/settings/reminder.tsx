import DateTimePicker from '@react-native-community/datetimepicker';
import type { CalendarNotificationTriggerInput } from 'expo-notifications';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Reminder() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reminders, setReminders] = useState<
    { id: string; time: Date; notificationId: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission needed', 'Please enable notifications to get reminders.');
        }
      }
    })();
  }, []);

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const formatTime = (time: Date) =>
    time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const scheduleNotification = async (time: Date) => {
    const now = new Date();
    let triggerDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      time.getHours(),
      time.getMinutes(),
      0
    );
    if (triggerDate <= now) triggerDate.setDate(triggerDate.getDate() + 1);

    const trigger: CalendarNotificationTriggerInput = {
      hour: triggerDate.getHours(),
      minute: triggerDate.getMinutes(),
      second: 0,
      repeats: true,
    };

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Reminder',
          body: `Time for your reminder at ${formatTime(time)}!`,
          sound: 'default',
        },
        trigger,
      });
      return notificationId;
    } catch (error: any) {
      Alert.alert('Error', `Failed to schedule notification: ${error.message}`);
      return null;
    }
  };

  const addReminder = async () => {
    const notificationId = await scheduleNotification(date);
    if (notificationId) {
      setReminders((prev) => [
        ...prev,
        { id: Math.random().toString(), time: date, notificationId },
      ]);
      Alert.alert('Success', `Reminder set for ${formatTime(date)}`);
    }
  };

  const cancelReminder = async (notificationId: string, id: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      setReminders((prev) => prev.filter((r) => r.id !== id));
      Alert.alert('Cancelled', 'Reminder cancelled successfully');
    } catch {
      Alert.alert('Error', 'Failed to cancel reminder');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Your Daily Reminder</Text>

      <TouchableOpacity
        style={styles.timePickerButton}
        activeOpacity={0.8}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.timePickerText}>{formatTime(date)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChange}
          style={styles.datePicker}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addReminder} activeOpacity={0.9}>
        <Text style={styles.addButtonText}>+ Add Reminder</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Your Reminders</Text>

      {reminders.length === 0 ? (
        <Text style={styles.noReminders}>No reminders yet</Text>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.reminderItem}>
              <Text style={styles.reminderTime}>{formatTime(item.time)}</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() => cancelReminder(item.notificationId, item.id)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 24,
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 24,
    textAlign: 'center',
  },
  timePickerButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 18,
    borderRadius: 14,
    marginHorizontal: 40,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 32,
    color: 'white',
    fontWeight: '800',
    letterSpacing: 2,
  },
  datePicker: {
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#0288D1',
    marginTop: 28,
    marginHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#0288D1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subHeader: {
    marginTop: 40,
    fontSize: 22,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 12,
    textAlign: 'center',
  },
  noReminders: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 20,
  },
  reminderItem: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#90CAF9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  reminderTime: {
    fontSize: 20,
    color: '#0D47A1',
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#E53935',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
