import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text } from 'react-native';

export default function Help() {
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Help & Support</Text>

      <Text style={[styles.paragraph, { color: colors.text }]}>
        If you're experiencing any issues or have questions, feel free to reach out to us.
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Email:</Text>
      <Text
        style={[styles.link, { color: colors.primary }]}
        onPress={() => Linking.openURL('mailto:your@email.com')}
      >
        miriyevmirparvin@gmail.com
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Phone:</Text>
      <Text
        style={[styles.link, { color: colors.primary }]}
        onPress={() => Linking.openURL('tel:+123456789')}
      >
        +1 234 567 89
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Instagram:</Text>
      <Text
        style={[styles.link, { color: colors.primary }]}
        onPress={() => Linking.openURL('')}
      >
        @Water Intake Reminder
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});
