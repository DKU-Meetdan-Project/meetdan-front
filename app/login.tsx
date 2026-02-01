// 파일: app/login.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import MeetDanLogo from "../components/Logo";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ 직접 import

import { InputBox } from "../components/InputBox";
import { MainButton } from "@/components/MainButton";
import { API } from "@/api/client";

export default function Login() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // 1. 유효성 검사
    if (!id) {
      Alert.alert("알림", "아이디(학번)를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      console.log(`🚀 [로그인 시도] ID: ${id}`);

      // 2. API 호출
      const result = await API.login("test@dankook.ac.kr"); // 테스트용 하드코딩
      console.log("📥 [API 응답]", JSON.stringify(result, null, 2));

      if (result.code === 200) {
        // 3. 토큰 추출 (구조 안전하게 확인)
        const token = result.data?.accessToken;

        if (!token) {
          console.error("❌ 토큰이 없습니다! 응답 구조를 확인하세요.");
          Alert.alert("오류", "서버 응답에 토큰이 없습니다.");
          return;
        }

        console.log("✅ 토큰 발견:", token);

        // 4. [핵심] 여기서 직접 저장 (AuthService 제거)
        await AsyncStorage.setItem("user_auth_token", token);
        console.log("💾 토큰 저장 완료! 메인으로 이동합니다.");

        // 5. 강제 이동
        router.replace("/(tabs)");
      } else {
        Alert.alert("로그인 실패", result.message || "다시 시도해주세요.");
      }
    } catch (e) {
      console.error("❌ 로그인 에러:", e);
      Alert.alert("오류", "로그인 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formArea}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <MeetDanLogo size={150} showText={true} />
        </View>
        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>단국대 포털 계정으로 로그인하세요</Text>

        <InputBox
          label="아이디 (학번)"
          placeholder="32XXXXXX"
          value={id}
          onChangeText={setId}
        />

        <InputBox
          label="비밀번호"
          placeholder="비밀번호 입력"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <MainButton
          title={isLoading ? "로그인 중..." : "로그인"}
          onPress={handleLogin}
          isLoading={isLoading}
        />

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20, alignSelf: "center" }}
        >
          <Text style={{ color: "#999" }}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  formArea: {
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 40,
  },
});
