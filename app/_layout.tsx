// 파일 경로: app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. 앱의 대문 (자동으로 login으로 보내주는 역할) */}
      <Stack.Screen name="index" />

      {/* 2. 로그인 화면 (탭바 없음, 전체 화면) */}
      <Stack.Screen name="login" />

      {/* 3. 메인 탭 화면 (로그인 성공하면 여기로 이동) */}
      <Stack.Screen name="(tabs)" />

      {/* 나머지 상세 화면들 */}
      <Stack.Screen name="write" options={{ presentation: 'modal' }} />
      <Stack.Screen name="join_team" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="post/[id]" />
    </Stack>
  );
}