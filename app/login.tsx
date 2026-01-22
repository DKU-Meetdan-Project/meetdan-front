import { useRouter } from "expo-router";
import { useState } from "react";
// 경로가 맞는지 확인 필요 (보통 @/components/... 로 통일하는 게 좋습니다)
import { InputBox } from "../components/InputBox";
import { MainButton } from "@/components/MainButton";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthService } from "@/utils/auth";
import { API } from "@/api/client";

export default function Login() {
  const router = useRouter();

  // State
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ [수정됨] 로그인 함수
  const handleLogin = async () => {
    // 1. 유효성 검사
    if (!id) {
      Alert.alert("알림", "아이디(학번)를 입력해주세요.");
      return;
    }
    // (비밀번호 검사도 필요하다면 추가)

    try {
      setIsLoading(true); // 로딩 시작

      // 2. API 호출
      // 🚨 현재 Mock API는 '@dankook.ac.kr' 이메일 형식만 통과시킵니다.
      // 테스트를 위해 일단 하드코딩된 이메일을 사용합니다.
      // 나중에는 `API.login(id)` 또는 `API.login(id + "@dankook.ac.kr")`로 바꿔야 합니다.
      const result = await API.login("test@dankook.ac.kr");

      if (result.code === 200) {
        // 3. 성공 시: 토큰 저장 및 메인 이동 (AuthService가 처리)
        console.log("로그인 성공, 토큰 저장 중...");
        await AuthService.login(result.data.accessToken);
      } else {
        // 실패 시
        Alert.alert("로그인 실패", result.message || "다시 시도해주세요.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("오류", "로그인 중 문제가 발생했습니다.");
    } finally {
      // 4. 로딩 종료 (성공하든 실패하든 무조건 실행)
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formArea}>
        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>단국대 포털 계정으로 로그인하세요</Text>

        {/* 아이디 입력창 */}
        <InputBox
          label="아이디 (학번)"
          placeholder="32XXXXXX"
          value={id}
          onChangeText={setId}
        />

        {/* 비밀번호 입력창 */}
        <InputBox
          label="비밀번호"
          placeholder="비밀번호 입력"
          value={password}
          onChangeText={setPassword}
          // InputBox 컴포넌트 내부 구현에 따라 secureTextEntry 프롭 이름 확인 필요
          // 보통 TextInput props를 그대로 전달한다면 secureTextEntry가 맞습니다.
          secureTextEntry={true}
        />

        {/* 로그인 버튼 */}
        <MainButton
          title={isLoading ? "로그인 중..." : "로그인"}
          onPress={handleLogin}
          isLoading={isLoading}
        />

        {/* 뒤로가기 (임시) */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20, alignSelf: "center" }}
        >
          <Text style={{ color: "#999" }}>이전 화면으로</Text>
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
  // InputBox 컴포넌트를 사용하므로 아래 스타일들은 필요 없을 수 있음 (InputBox 내부에 있다면)
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
});
