import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router"; // ✅ useSegments 추가
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthService } from "@/utils/auth";

// 스플래시 스크린 자동 숨김 방지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 폰트 로딩 (에러 나면 일단 주석 처리 하셨죠?)
  const [loaded] = [true]; /*useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });*/

  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments(); // ✅ 현재 내가 어느 화면에 있는지 파악

  useEffect(() => {
    // 폰트 로딩 전이면 실행 안 함
    if (!loaded) return;

    const checkLoginStatus = async () => {
      const token = await AuthService.getToken();
      const inAuthGroup = segments[0] === "login"; // 현재 화면이 로그인 화면인가?

      console.log(
        `[AuthCheck] 토큰: ${token ? "있음" : "없음"} / 현재위치: ${segments[0] || "root"}`,
      );

      // 🚨 무한루프 방지 로직
      if (token && inAuthGroup) {
        // 1. 토큰이 있는데 로그인 화면이다? -> 메인으로 내쫓음
        router.replace("/(tabs)");
      } else if (!token && !inAuthGroup) {
        // 2. 토큰이 없는데 로그인 화면이 아니다? -> 로그인으로 내쫓음
        router.replace("/login");
      }
      // 3. (중요) 토큰 없고 이미 로그인 화면이면? -> 아무것도 안 함 (가만히 둠)

      setIsReady(true);
      await SplashScreen.hideAsync();
    };

    checkLoginStatus();
  }, [loaded, segments]); // ✅ segments가 바뀔 때마다 검사

  // 로딩 중일 때
  if (!loaded || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3288FF" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        {/* +not-found 에러 뜨면 아래 줄 지우세요. 파일이 없어서 나는 경고입니다. */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
