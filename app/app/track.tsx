import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import API_URL from "@/Constants";
import { useRouter, useFocusEffect } from "expo-router"

export default function Track() {
  const router = useRouter()
  const navigation = useNavigation<any>();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const checkLoginAndFetch = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          router.push("/login");
        }

        // Token exists, fetch complaints
        const response = await fetch(`${API_URL}/api/user/my-reports`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setComplaints(data.reports || []);
        } else {
          console.error("API error:", data.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetch();
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-600">Loading complaints...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-4 py-4 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {complaints.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">No complaints found.</Text>
        ) : (
          complaints.map((complaint, index) => (
            <View
              key={index}
              className="bg-white rounded-xl shadow-lg p-5 mb-4 border border-gray-50"
            >
              <Text className="text-xl font-bold text-blue-800 mb-3">
                {complaint.title}
              </Text>
              <Text className="px-3 py-1 rounded-full text-sm font-semibold mb-3 bg-blue-100 text-blue-700 w-fit">
                {complaint.status}
              </Text>
              <View className="mb-3 space-y-1">
                <Text className="text-sm text-gray-600">
                  Department: {complaint.department.charAt(0).toUpperCase() + complaint.department.slice(1) || "N/A"}
                </Text>
                <Text className="text-sm text-gray-600">
                  Location: {complaint.location || "N/A"}
                </Text>
                <Text className="text-sm text-gray-600">
                  Submitted: {formatDate(complaint.createdAt)}
                </Text>
              </View>
              <Text className="text-gray-700 text-sm">{complaint.description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
