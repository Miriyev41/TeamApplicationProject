import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

export const unstable_settings = {
  title: 'Settings',
};

export default function SettingsIndex() {
  const router = useRouter();
  const [dailyGoal, setDailyGoal] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchDailyGoal = async () => {
      try {
        const goal = await AsyncStorage.getItem('dailyGoal');
        if (goal !== null) {
          setDailyGoal(goal);
        }
      } catch (e) {
        console.error('Failed to load daily goal from storage');
      }
    };

    fetchDailyGoal();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/profile')}
        >
          <View style={styles.iconAndLabel}>
            <Text style={styles.emoji}>😊</Text>
            <Text style={[styles.label, { color: colors.text }]}>My Profile</Text>
          </View>
          <Text style={[styles.goal, { color: colors.text }]}>
            Goal: {dailyGoal !== null ? `${dailyGoal} mL` : 'Loading...'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/general')}
        >
          <View style={styles.iconAndLabel}>
            <MaterialCommunityIcons name="cog" size={20} color={colors.text} />
            <Text style={[styles.label, { color: colors.text }]}>General Settings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/reminder')}
        >
          <View style={styles.iconAndLabel}>
            <MaterialCommunityIcons name="bell-outline" size={20} color={colors.text} />
            <Text style={[styles.label, { color: colors.text }]}>Reminder Settings</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/tips')}
        >
          <View style={styles.iconAndLabel}>
            <MaterialCommunityIcons name="water" size={20} color={colors.text} />
            <Text style={[styles.label, { color: colors.text }]}>Hydration Tips</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/feedback')}
        >
          <View style={styles.iconAndLabel}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
            <Text style={[styles.label, { color: colors.text }]}>Feedback</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/help')}
        >
          <View style={styles.iconAndLabel}>
            <Ionicons name="help-circle-outline" size={20} color={colors.text} />
            <Text style={[styles.label, { color: colors.text }]}>Help & Contact</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  iconAndLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
  },
  goal: {
    fontSize: 14,
  },
});
