import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const hydrationData = [
  {
    category: '🥒 Vegetables',
    items: [
      { name: 'Cucumber', content: '96%' },
      { name: 'Lettuce (Iceberg)', content: '95%' },
      { name: 'Celery', content: '95%' },
      { name: 'Radish', content: '95%' },
      { name: 'Zucchini', content: '94%' },
      { name: 'Tomato', content: '94%' },
      { name: 'Spinach', content: '93%' },
      { name: 'Bell Pepper', content: '92%' },
      { name: 'Cauliflower', content: '92%' },
      { name: 'Broccoli', content: '91%' },
      { name: 'Carrot', content: '88%' },
      { name: 'Green Cabbage', content: '93%' },
    ],
  },
  {
    category: '🍉 Fruits',
    items: [
      { name: 'Watermelon', content: '92%' },
      { name: 'Strawberries', content: '91%' },
      { name: 'Cantaloupe', content: '90%' },
      { name: 'Peaches', content: '89%' },
      { name: 'Oranges', content: '87%' },
      { name: 'Pineapple', content: '86%' },
      { name: 'Raspberries', content: '86%' },
      { name: 'Grapefruit', content: '88%' },
      { name: 'Apples', content: '84%' },
      { name: 'Blueberries', content: '84%' },
      { name: 'Mango', content: '83%' },
      { name: 'Grapes', content: '81%' },
    ],
  },
  {
    category: '🥣 Dairy & Alternatives',
    items: [
      { name: 'Skim Milk', content: '91%' },
      { name: 'Yogurt (plain)', content: '85%' },
      { name: 'Cottage Cheese', content: '80%' },
      { name: 'Soy Milk', content: '89%' },
      { name: 'Almond Milk', content: '88%' },
    ],
  },
  {
    category: '🍲 Soups & Liquids',
    items: [
      { name: 'Chicken Broth', content: '92%' },
      { name: 'Vegetable Soup', content: '90%+' },
      { name: 'Tomato Soup', content: '89%' },
    ],
  },
  {
    category: '🥤 Beverages',
    items: [
      { name: 'Water', content: '100%' },
      { name: 'Herbal Tea', content: '99%' },
      { name: 'Coconut Water', content: '95%' },
      { name: 'Milk', content: '90-91%' },
      { name: 'Fruit Juice', content: '85-89%' },
    ],
  },
];

export default function TipsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💧 Hydrating Foods & Drinks</Text>
      <Text style={styles.subtitle}>Foods rich in water help you stay hydrated throughout the day.</Text>
      {hydrationData.map((section, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.category}>{section.category}</Text>
          {section.items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.food}>{item.name}</Text>
              <Text style={styles.content}>{item.content}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#E6F7FA',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#005B64',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#007B7F',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    elevation: 1,
  },
  food: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007B7F',
  },
});
