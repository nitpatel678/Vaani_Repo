import React, { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { Users, FileText, Shield } from "lucide-react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useRouter, useFocusEffect } from "expo-router"
import Splash from "./SplashScreen"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Index() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkLogin = async () => {
        const token = await AsyncStorage.getItem("token");
        setIsLoggedIn(!!token);
      };
      checkLogin();
    }, [])
  );

  const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login"); 
  } catch (error) {
    console.error("Error logging out:", error);
  }
};


  if (!isReady) {
    return <Splash onFinish={() => setIsReady(true)} />
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
        <ScrollView contentContainerClassName="flex-grow">
          {/* Header */}
          <View className="border-b border-border bg-card/50">
            <View className="px-4 py-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                {/* <View className="w-8 h-8 bg-primary rounded-lg items-center justify-center">
                  <Image
                    source={require("../assets/images/vaani_logo.jpg")}
                    className="w-3 h-3"
                    resizeMode="contain"
                  />
                </View> */}
                <Text className="text-xl font-bold text-accent">Vaani</Text>
              </View>

              <View className="flex-row gap-2">
              {!isLoggedIn ? (
                <TouchableOpacity
                  className="border border-border rounded-lg px-3 py-2"
                  onPress={() => router.push("/login")}
                >
                  <Text className="text-foreground">Login</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="border border-border rounded-lg px-3 py-2 bg-red-500"
                  onPress={handleLogout}
                >
                  <Text className="text-white">Logout</Text>
                </TouchableOpacity>
              )}
            </View>
            </View>
          </View>

          {/* Hero Section */}
          <View className="py-16 px-4 items-center">
            <View className="mb-4 bg-secondary px-3 py-1 rounded-full">
              <Text className="text-foreground">Your City, Your Voice</Text>
            </View>

            <Text className="text-4xl font-bold text-foreground text-center mb-6">
              Report Problems Around{"\n"}
              <Text className="text-accent">Your Neighborhood</Text>
            </Text>

            <Text className="text-lg text-muted-foreground text-center mb-8">
              Use Vaani to quickly report issues like potholes, broken
              streetlights, or waste collection. Stay updated on your
              complaint’s progress in real time.
            </Text>

            <View className="flex-col gap-3 w-full items-center">
              <TouchableOpacity className="bg-primary px-5 py-3 rounded-lg w-full items-center"
              onPress={() => router.push("/submit")}              
              >
                <Text className="text-white text-base font-medium">Report an Issue</Text>
              </TouchableOpacity>

              <TouchableOpacity className="border border-border px-5 py-3 rounded-lg w-full items-center"
              onPress={() => router.push("/track")}
              >
                <Text className="text-foreground text-base font-medium">Track My Complaints</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features Section */}
          <View className="py-12 px-4 bg-muted/30">
            <Text className="text-3xl font-bold text-center text-foreground mb-2">
              Why Use Vaani?
            </Text>
            <Text className="text-muted-foreground text-center mb-8">
              Simple, transparent, and reliable for every citizen
            </Text>

            <View className="gap-6">
              {/* Easy Reporting */}
              <View className="border border-border rounded-xl p-5 bg-card">
                <View className="w-12 h-12 bg-accent/10 rounded-lg items-center justify-center mb-4">
                  <Users size={24} color="#06b6d4" />
                </View>
                <Text className="text-lg font-semibold mb-1">Quick & Simple</Text>
                <Text className="text-muted-foreground mb-3">
                  Report a problem in just a few taps from your phone.
                </Text>
                <Text className="text-sm text-muted-foreground">• Upload photos instantly</Text>
                <Text className="text-sm text-muted-foreground">• Share exact location</Text>
                <Text className="text-sm text-muted-foreground">• No paperwork required</Text>
              </View>

              {/* Real-time Tracking */}
              <View className="border border-border rounded-xl p-5 bg-card">
                <View className="w-12 h-12 bg-primary/10 rounded-lg items-center justify-center mb-4">
                  <Shield size={24} color="#2563eb" />
                </View>
                <Text className="text-lg font-semibold mb-1">Track Progress</Text>
                <Text className="text-muted-foreground mb-3">
                  Get notified as officials work on your complaint.
                </Text>
                <Text className="text-sm text-muted-foreground">• Live status updates</Text>
                <Text className="text-sm text-muted-foreground">• Transparency at each step</Text>
                <Text className="text-sm text-muted-foreground">• No need to follow up manually</Text>
              </View>

              {/* Stay Empowered */}
              <View className="border border-border rounded-xl p-5 bg-card">
                <View className="w-12 h-12 bg-destructive/10 rounded-lg items-center justify-center mb-4">
                  <FileText size={24} color="#dc2626" />
                </View>
                <Text className="text-lg font-semibold mb-1">Stay Informed</Text>
                <Text className="text-muted-foreground mb-3">
                  Check complaint history and get closure when resolved.
                </Text>
                <Text className="text-sm text-muted-foreground">• View past complaints</Text>
                <Text className="text-sm text-muted-foreground">• Receive closure reports</Text>
                <Text className="text-sm text-muted-foreground">• Build a safer community</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="border-t border-border py-8 px-4 items-center">
            <Text className="text-muted-foreground">
              © 2025 Vaani. Empowering citizens, one complaint at a time.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
