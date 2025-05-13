import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

export default function WaterHistorySection() {
  const [activeTab, setActiveTab] = useState("DAY");
  const [currentIntake, setCurrentIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2433); // default, in case nothing is stored

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

  const dataByTab = {
    DAY: {
      labels: Array.from({ length: 25 }, (_, i) => i.toString()),
      data: [200, 0, 150, 0, 0, 300, 0, 0, 100, 0, 0, 200, 0, 100, 0, 0, 0, 300, 0, 0, 0, 100, 0, 0, 0],
      total: currentIntake,
      targetLeft: Math.max(0, dailyGoal - currentIntake),
    },
    WEEK: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [2000, 1800, 1500, 2200, 1900, 1600, 2100],
      total: currentIntake,
      targetLeft: Math.max(0, dailyGoal * 7 - currentIntake),
    },
    MONTH: {
      labels: Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`),
      data: [1800, 1900, 1700, 2000, 1800, 1900, 1700, 2000, 1800, 1900],
      total: currentIntake,
      targetLeft: Math.max(0, dailyGoal * 30 - currentIntake),
    },
    YEAR: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [50000, 45000, 48000, 52000, 49000, 47000],
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
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2563eb", marginBottom: 16 }}>History</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        {["DAY", "WEEK", "MONTH", "YEAR"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 9999,
              backgroundColor: activeTab === tab ? "#3b82f6" : "#e5e7eb",
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: "500",
              color: activeTab === tab ? "#fff" : "#374151",
            }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>{activeTab === "DAY" ? "Today" : `${activeTab} Overview`}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
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
          height={160}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 8 }}
        />
      </View>

      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 }}>
        <Text style={{ fontSize: 14, color: "#6b7280" }}>Next time</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#2563eb" }}>08:00</Text>
      </View>

      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 32, elevation: 2 }}>
        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Records</Text>
        <TouchableOpacity>
          <Text style={{ color: "#3b82f6", fontWeight: "500" }}>View All Records</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
