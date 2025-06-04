# WaterReminder & Team Application Project

A React Native app built with [Expo](https://expo.dev) that helps you track your daily water intake, manage hydration goals, collect user feedback, and configure general settings like volume and weight units — all with persistent local storage.

---

## Features

- Submit multi-line user feedback with validation.
- Choose measurement units (`ml`, `litres`) and weight units (`kg`, `lbs`) via modals.
- Calculate daily water intake and track hydration goals.
- View hydration history summarized by week, month, and year.
- Save user preferences and data locally using AsyncStorage.
- Lightweight, user-friendly interface designed for Expo Go.
- File-based routing inside the `app` directory for smooth navigation.
- History tab with detailed water intake stats (`app/(tabs)/history.tsx`).

---

## Getting Started with Expo

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go app installed on your Android device

### Installation

1. Clone the repository:
   git clone https://github.com/Miriyev41/TeamApplicationProject-64523_64287_66258-.git
   cd TeamApplicationProject-64523_64287_66258-
Install dependencies:

npm install
# or
yarn install
Start the app:

npx expo start
Running the App
After starting the app, you can open it in:

A development build

Project Structure
All main app code is located inside the app directory.

Navigation uses file-based routing.

Key feature files:

app/(tabs)/history.tsx — History tab with hydration statistics.

