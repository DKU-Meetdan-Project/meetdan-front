// 파일 경로: app/login.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { InputBox } from "../components/InputBox";
import { MainButton } from "@/components/MainButton";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();

  // 사용자의 입력을 저장하는 변수들 (State)
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 시 로딩 시간 만드는 함수
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 버튼 눌렀을 때 실행되는 함수
  const handleLogin = async () => {
    // 나중에 여기에 백엔드 API 연동 코드가 들어갑니다!
    // 유효성 검사
    if (id.length < 8) {
      Alert.alert("알림", "올바른 아이디를 입력해주세요.");
      return;
    }
    setIsLoading(true);

    // 모의 로그인 지연 (2초)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);

    // 로그인 성공 처리 (임시)
    Alert.alert("알림", "환영합니다!");
    // 임시로 바로 메인화면으로 이동시킴
    router.replace("/(tabs)"); // 뒤로가기 방지 위해 replace 사용
  };

  // 컴포넌트 재활용
  interface InputBoxProps {
    label: string; // 제목은 문자열
    placeholder: string; // 힌트글도 문자열
    value: string; // 입력값도 문자열
    onChangeText: (text: string) => void; // 이건 "문자열을 받아서 아무것도 반환 안 하는 함수(void)"라는 뜻
    isPassword?: boolean; // 물음표(?)는 "있을 수도 있고 없을 수도 있다(Optional)"는 뜻
  }

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
          onPress={() => router.push("/auth/signup")}
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
    paddingHorizontal: 30, // 양옆 여백
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
