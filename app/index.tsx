// 파일 경로: app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // 앱을 켜자마자 '/login' 화면으로 강제 이동시킵니다.
  // 사용자는 이 화면을 거의 못 보고 바로 로그인 화면을 보게 됩니다.
  return <Redirect href="/login" />;
}