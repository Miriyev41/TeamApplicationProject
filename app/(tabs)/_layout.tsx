import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          // Customize the top header bar (for the "Home" tab)
          headerStyle: {
            backgroundColor: '#0288D1', // Change to your desired top bar color
          },
          headerTintColor: '#ffffff', // Text color in the header (white in this case)
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
          // Customize the top header bar (for the "History" tab)
          headerStyle: {
            backgroundColor: '#0288D1', // Change to your desired top bar color
          },
          headerTintColor: '#ffffff', // Text color in the header (white in this case)
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
          // Customize the top header bar (for the "Settings" tab)
          headerStyle: {
            backgroundColor: '#0288D1', // Change to your desired top bar color
          },
          headerTintColor: '#ffffff', // Text color in the header (white in this case)
        }}
      />
    </Tabs>
  );
}
