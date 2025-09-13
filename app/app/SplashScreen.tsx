// SplashScreen.tsx
import React, { useEffect } from "react"
import { View, Image, StyleSheet, StatusBar } from "react-native"
import * as SplashScreen from "expo-splash-screen"

// Prevent auto-hide on app start
SplashScreen.preventAutoHideAsync()

export default function Splash({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync()
      onFinish()
    }, 1000) // 2 seconds splash duration

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require("../assets/images/vaani_logo.jpg")} // your splash image
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // primary blue background
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
})
