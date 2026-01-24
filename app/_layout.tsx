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
import { ActivityIndicator, View } from "react-native";

// ✅ 방금 만든 파일 import
import * as AuthService from "../utils/auth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = [true]; /* useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  }); */

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loaded || !navigationState?.key) return;

    const checkLoginStatus = async () => {
      const token = await AuthService.getToken(); // ✅ 이제 에러 안 남

      const inAuthGroup = segments[0] === "login";

      // ✅ [수정] 타입스크립트 에러 해결 (as string[])
      // "segments가 비어있을 수도 있으니까 string 배열로 취급해줘"라고 명시
      const inRoot = (segments as string[]).length === 0;

      console.log(
        `[AuthCheck] 토큰: ${token ? "있음" : "없음"} / 위치: ${inRoot ? "root" : segments[0]}`,
      );

      if (token && (inAuthGroup || inRoot)) {
        router.replace("/(tabs)");
      } else if (!token && !inAuthGroup) {
        router.replace("/login");
      }

      setIsReady(true);
      await SplashScreen.hideAsync();
    };

    checkLoginStatus();
  }, [loaded, navigationState?.key]);

  if (!loaded || !isReady) {
    // 로딩 중일 때 빈 화면 대신 스피너 보여주기
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3288FF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  );
}
