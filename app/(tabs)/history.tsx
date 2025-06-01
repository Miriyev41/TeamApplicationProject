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

type TabType = "DAY" | "WEEK" | "MONTH" | "YEAR";

type TabData = {
  labels: string[];
  data: number[];
  total: number;
  targetLeft: number;
};

export default function WaterHistorySection() {
  const [activeTab, setActiveTab] = useState<TabType>("DAY");
  const [currentIntake, setCurrentIntake] = useState<number>(0);
  const [dailyGoal, setDailyGoal] = useState<number>(2433);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIntake = await AsyncStorage.getItem("currentIntake");
        const storedGoal = await AsyncStorage.getItem("dailyGoal");

        if (storedIntake !== null) setCurrentIntake(parseFloat(storedIntake));
        if (storedGoal !== null) setDailyGoal(parseFloat(storedGoal));
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const dayTimes = Array.from({ length: 8 }, (_, i) => {
    const hour = i * 3;
    return hour < 10 ? `0${hour}:00` : `${hour}:00`;
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
    backgroundGradientFrom: "#f9fafb",
    backgroundGradientTo: "#f9fafb",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const currentData = dataByTab[activeTab];

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        maxWidth: 420,
        alignSelf: "center",
        flexGrow: 1,
        backgroundColor: "#f0f4ff",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#2563eb",
          marginBottom: 24,
          letterSpacing: 1,
        }}
      >
        💧 History
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 24,
          backgroundColor: "#e0e7ff",
          borderRadius: 24,
          padding: 6,
          elevation: 2,
        }}
      >
        {(["DAY", "WEEK", "MONTH", "YEAR"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              flex: 1,
              marginHorizontal: 6,
              paddingVertical: 12,
              borderRadius: 20,
              backgroundColor: activeTab === tab ? "#3b82f6" : "transparent",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: activeTab === tab ? "#2563eb" : "transparent",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: activeTab === tab ? 0.3 : 0,
              shadowRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: activeTab === tab ? "#fff" : "#2563eb",
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
          backgroundColor: "#e6edff", 
          borderRadius: 24,
          padding: 24,
          marginBottom: 30,
          elevation: 8,
          shadowColor: "#3b82f6",
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 12,
            color: "#1e40af",
          }}
        >
          {
  activeTab === "DAY"
    ? "Today"
    : activeTab === "WEEK"
    ? "Weekly Overview"
    : activeTab === "MONTH"
    ? "Monthly Overview"
    : activeTab === "YEAR"
    ? "Yearly Overview"
    : `${activeTab} Overview`
}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#1f2937" }}>
            Total:{" "}
            <Text style={{ color: "#2563eb" }}>{currentData.total} ml</Text>
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#1f2937" }}>
            Target Left:{" "}
            <Text style={{ color: "#ef4444" }}>{currentData.targetLeft} ml</Text>
          </Text>
        </View>

        <LineChart
          data={{
            labels: currentData.labels,
            datasets: [
              {
                data: currentData.data,
                color: () => "#3b82f6",
                strokeWidth: 3,
              },
            ],
          }}
          width={screenWidth - 48}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 24 }}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withDots={true}
          fromZero
        />
      </View>
    </ScrollView>
  );
}
