// 파일: app/index.tsx
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  // 이 화면은 _layout.tsx가 로그인 여부를 검사해서
  // '/login'이나 '/(tabs)'로 보내기 전까지
  // 아주 잠깐 보여지는 '대기실'입니다.
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#3288FF" />
    </View>
  );
}
