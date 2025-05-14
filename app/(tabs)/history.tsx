import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

// Define allowed tab types
type TabType = "DAY" | "WEEK" | "MONTH" | "YEAR";

// Define structure for chart data
type TabData = {
  labels: string[];
  data: number[];
  total: number;
  targetLeft: number;
};

export default function WaterHistorySection() {
  const [activeTab, setActiveTab] = useState<TabType>("DAY");
  const [currentIntake, setCurrentIntake] = useState<number>(0);
  const [dailyGoal, setDailyGoal] = useState<number>(2433); // default if not stored

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIntake = await AsyncStorage.getItem("currentIntake");
        const storedGoal = await AsyncStorage.getItem("dailyGoal");

        if (storedIntake !== null) {
          setCurrentIntake(parseFloat(storedIntake));
        }
        if (storedGoal !== null) {
          setDailyGoal(parseFloat(storedGoal));
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const dayTimes = Array.from({ length: 8 }, (_, i) => {
    const hour = i * 3;
    const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    return formattedHour;
  });

  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (5 - i));
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  });

  const dataByTab: Record<TabType, TabData> = {
    DAY: {
      labels: dayTimes,
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      total: currentIntake,
      targetLeft: Math.max(0, dailyGoal - currentIntake),
    },
    WEEK: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [0, 0, 0, 0, 0, 0, 0],
      total: currentIntake,
      targetLeft: Math.max(0, dailyGoal * 7 - currentIntake),
    },
    MONTH: {
      labels: last5Days,
      data: [0, 0, 0, 0, 0],
      total: currentIntake,
      targetLeft: Math.max(0, dailyGoal * 30 - currentIntake),
    },
    YEAR: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [0, 0, 0, 0, 0, 0],
      total: currentIntake,
      targetLeft: Math.max(0, dailyGoal * 365 - currentIntake),
    },
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const currentData = dataByTab[activeTab];

  return (
    <ScrollView contentContainerStyle={{ padding: 16, maxWidth: 400, alignSelf: "center" }}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: "#2563eb",
          marginBottom: 20,
          letterSpacing: 1,
        }}
      >
        💧 History
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
          backgroundColor: "#f1f5f9",
          borderRadius: 16,
          padding: 6,
        }}
      >
        {["DAY", "WEEK", "MONTH", "YEAR"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as TabType)}
            style={{
              flex: 1,
              marginHorizontal: 4,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: activeTab === tab ? "#3b82f6" : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeTab === tab ? "#fff" : "#3b82f6",
                letterSpacing: 0.5,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: 20,
          padding: 18,
          marginBottom: 20,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 10,
            color: "#1e40af",
          }}
        >
          {activeTab === "DAY" ? "Today" : `${activeTab} Overview`}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}>
            Total: <Text style={{ color: "#2563eb" }}>{currentData.total} ml</Text>
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}>
            Target Left: <Text style={{ color: "#ef4444" }}>{currentData.targetLeft} ml</Text>
          </Text>
        </View>
        <LineChart
          data={{
            labels: currentData.labels,
            datasets: [
              {
                data: currentData.data,
                color: () => "#3b82f6",
                strokeWidth: 2,
              },
            ],
          }}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      <View
        style={{
          backgroundColor: "#f0f9ff",
          borderRadius: 20,
          padding: 18,
          marginBottom: 20,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Next time</Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#2563eb" }}>08:00</Text>
      </View>

      <View
        style={{
          backgroundColor: "#f0f9ff",
          borderRadius: 20,
          padding: 18,
          marginBottom: 40,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>Records</Text>
        <TouchableOpacity>
          <Text style={{ color: "#3b82f6", fontWeight: "600" }}>📄 View All Records</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
