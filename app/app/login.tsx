import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../Constants"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token locally
      await AsyncStorage.setItem("token", data.token);

      // Redirect to dashboard/home
      router.push("/");

    } catch (error:any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5 justify-center">
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center">
          <User size={32} color="white" />
        </View>
        <Text className="text-2xl font-bold mt-4 text-gray-800">Welcome Back</Text>
        <Text className="text-gray-500">Login to continue using the app</Text>
      </View>

      <View className="space-y-4">
        <Text className="text-gray-700 font-medium">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="text-gray-700 font-medium">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading || !email || !password}
          className="bg-blue-500 py-3 rounded-lg items-center"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-center text-sm text-gray-500 mt-6">
        Don’t have an account?{" "}
        <Text
          className="text-blue-500 font-semibold"
          onPress={() => router.push("/signup")}
        >
          Sign Up
        </Text>
      </Text>
    </SafeAreaView>
  );
}
