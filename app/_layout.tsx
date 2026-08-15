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
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
// ❌ Animated는 삭제했습니다!

import * as AuthService from "../utils/auth";
import { API } from "@/api/client";
import MeetDanLogo from "@/components/Logo";
import { useStore } from "@/store/useStore";

// 앱이 로딩될 때까지 네이티브 화면 유지 (우리가 수동으로 끌 것임)
SplashScreen.preventAutoHideAsync();

/** 로그인 없이 들어갈 수 있는 화면들 */
const PUBLIC_ROUTES = ["login", "signupScreen"];

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
        const token = await AuthService.getToken();
        const inAuthGroup = PUBLIC_ROUTES.includes(segments[0] as string);
        const inRoot = (segments as string[]).length === 0;

        // 앱을 껐다 켜면 전역 상태는 비어 있으므로 내 정보를 다시 받아온다
        if (token && !useStore.getState().currentUser) {
          try {
            const me = await API.getMe();
            if (me.code === 200 && me.data) {
              useStore.getState().setCurrentUser(me.data);
            }
          } catch (e) {
            // 내 정보를 못 받아와도 라우팅은 계속 진행한다
            console.error("내 정보 복원 실패:", e);
          }
        }

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

    // 🛡️ 안전장치: 로그인 체크가 예기치 않게 멈추면 3초 뒤에 강제로 문 열기
    // (정상 흐름에서는 체크가 먼저 끝나므로 이 타이머는 발동하지 않습니다)
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, [loaded, navigationState?.key]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 화면들이 노치/홈바 여백을 직접 계산할 수 있게 인셋 제공 */}
      <SafeAreaProvider>
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
      </SafeAreaProvider>
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
