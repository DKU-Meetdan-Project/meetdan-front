// 파일: app/_layout.tsx
import { useFonts } from "expo-font";
import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StyleSheet } from "react-native";
// ❌ Animated는 삭제했습니다!

import * as AuthService from "../utils/auth";
import MeetDanLogo from "@/components/Logo";

// 앱이 로딩될 때까지 네이티브 화면 유지 (우리가 수동으로 끌 것임)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = [true]; // 폰트 로딩 (가정)
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  // ✅ isReady가 false면: 로고 화면 보여줌
  // ✅ isReady가 true면: 메인 화면 보여줌
  const [isReady, setIsReady] = useState(false);

  // 1️⃣ 앱 켜지자마자 "흰색 네이티브 화면"은 바로 치워버리기
  // 그래야 뒤에 있는 "우리 로고"가 바로 보입니다.
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // 2️⃣ 로그인 체크 및 라우팅 로직
  useEffect(() => {
    if (!loaded || !navigationState?.key) return;

    const checkLoginStatus = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 💤 인위적 딜레이 (로고 감상용)
        const token = await AuthService.getToken();
        const inAuthGroup = segments[0] === "login";
        const inRoot = (segments as string[]).length === 0;

        // 로그인 여부에 따라 납치
        if (token && (inAuthGroup || inRoot)) {
          router.replace("/(tabs)");
        } else if (!token && !inAuthGroup) {
          router.replace("/login");
        }
      } catch (e) {
        console.error("초기화 에러:", e);
      } finally {
        // ✅ 로직이 끝나면 로고 화면 끄기!
        setIsReady(true);
      }
    };

    checkLoginStatus();

    // 🛡️ 안전장치: 혹시라도 로직이 꼬이면 1.5초 뒤에 강제로 문 열기
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, [loaded, navigationState?.key]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 1. 메인 앱 화면 (평소엔 여기 보임) */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* 2. 커스텀 스플래쉬 화면 (isReady가 false일 때만 덮어씌움) */}
      {!isReady && (
        <View style={styles.splashContainer}>
          <MeetDanLogo size={150} showText={true} />
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject, // 화면 전체 꽉 채우기
    backgroundColor: "#ffffff", // 배경색
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // 다른 화면보다 무조건 위에 뜨게
  },
});
