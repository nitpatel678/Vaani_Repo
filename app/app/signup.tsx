import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native"
import { User } from "lucide-react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { API_URL } from "../Constants"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword || !phone) {
      Alert.alert("Error", "Please fill all fields")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
         credentials: "include",
      })
      console.error(response);
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      Alert.alert("Success", "Account created successfully!")
      router.push("/login")
    } catch (error:any) {
      Alert.alert("Signup Failed", error.message)
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Dismiss keyboard when tapping outside */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={80} // adjust if header is present
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 20,
              paddingBottom: 40, // ensures space below last input
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center">
                <User size={32} color="white" />
              </View>
              <Text className="text-2xl font-bold mt-4 text-gray-800">Sign Up</Text>
              <Text className="text-gray-500">Create your account to get started</Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <Text className="text-gray-700 font-medium">Full Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />

              <Text className="text-gray-700 font-medium">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <Text className="text-gray-700 font-medium">Phone Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter your phone number"
                keyboardType="numeric"
                value={phone}
                onChangeText={setPhone}
              />

              <Text className="text-gray-700 font-medium">Password</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <Text className="text-gray-700 font-medium">Confirm Password</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Confirm your password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              {/* Button */}
              <TouchableOpacity
                className={`bg-blue-500 rounded-lg py-3 items-center mt-4 ${
                  isLoading ? "opacity-70" : ""
                }`}
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Already have account */}
            <TouchableOpacity onPress={() => router.push("/login")} className="mt-8">
              <Text className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Text className="text-blue-500 font-semibold">Log in</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}
