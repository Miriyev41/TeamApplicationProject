import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');

  const handleSend = () => {
    if (feedback.trim() === '') {
      Alert.alert('Please enter your feedback');
      return;
    }

    console.log('User Feedback:', feedback);
    Alert.alert('Thank you!', 'Your feedback has been sent.');
    setFeedback('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Send Feedback</Text>
      <Text style={styles.subtitle}>We appreciate your thoughts and suggestions.</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Write your feedback here..."
        multiline
        numberOfLines={6}
        value={feedback}
        onChangeText={setFeedback}
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f8e9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#33691e',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#558b2f',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderColor: '#8bc34a',
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#558b2f',
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
