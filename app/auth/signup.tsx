import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// ✅ 기존에 사용하던 공통 컴포넌트 재사용
import { InputBox } from "../../components/InputBox";
import { MainButton } from "../../components/MainButton";
// ✅ API 클라이언트
import { API } from "../../api/client";

export default function SignupScreen() {
  const router = useRouter();

  // 1. 입력 상태 관리
  const [id, setId] = useState(""); // 아이디 (학번)
  const [password, setPassword] = useState(""); // 비밀번호
  const [name, setName] = useState(""); // 이름
  const [gender, setGender] = useState<"M" | "F" | null>(null); // 성별
  const [loading, setLoading] = useState(false);

  // 2. 회원가입 처리 함수
  const handleSignup = async () => {
    // 유효성 검사
    if (!id || !password || !name) {
      Alert.alert("알림", "모든 정보를 입력해주세요.");
      return;
    }
    if (!gender) {
      Alert.alert("알림", "성별을 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      // API 호출 (client.ts에 signup 함수가 필요합니다 - 아래 참고)
      const result = await API.signup({
        id,
        password,
        name,
        gender,
      });

      if (result.code === 200) {
        Alert.alert("가입 성공", "회원가입이 완료되었습니다!\n로그인해주세요.", [
          {
            text: "확인",
            onPress: () => router.replace("/login"), // 로그인 화면으로 이동
          },
        ]);
      } else {
        Alert.alert("가입 실패", result.message || "이미 존재하는 계정입니다.");
      }
    } catch (e) {
      Alert.alert("오류", "회원가입 중 문제가 발생했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 영역 */}
        <View style={styles.header}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>
            단국대생을 위한 밋단에 오신 것을 환영해요! 👋
          </Text>
        </View>

        {/* 입력 폼 영역 */}
        <View style={styles.formContainer}>
          <InputBox
            label="아이디 (학번)"
            placeholder="예: 32210000"
            value={id}
            onChangeText={setId}
            keyboardType="number-pad"
          />

          <InputBox
            label="비밀번호"
            placeholder="비밀번호 입력"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <InputBox
            label="이름"
            placeholder="본명을 입력해주세요"
            value={name}
            onChangeText={setName}
          />

          {/* 성별 선택 (커스텀 UI) */}
          <View style={styles.genderContainer}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderRow}>
              {/* 남자 버튼 */}
              <TouchableOpacity
                style={[
                  styles.genderBtn,
                  gender === "M" && styles.genderBtnMaleSelected,
                ]}
                onPress={() => setGender("M")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="male"
                  size={20}
                  color={gender === "M" ? "#3288FF" : "#ccc"}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "M" && styles.genderTextMale,
                  ]}
                >
                  남자
                </Text>
              </TouchableOpacity>

              {/* 여자 버튼 */}
              <TouchableOpacity
                style={[
                  styles.genderBtn,
                  gender === "F" && styles.genderBtnFemaleSelected,
                ]}
                onPress={() => setGender("F")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="female"
                  size={20}
                  color={gender === "F" ? "#FF6B6B" : "#ccc"}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "F" && styles.genderTextFemale,
                  ]}
                >
                  여자
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <MainButton
              title={loading ? "가입 처리 중..." : "가입하기"}
              onPress={handleSignup}
              isLoading={loading}
            />
          </View>

          {/* 로그인하러 가기 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
  formContainer: {
    gap: 10, // InputBox 사이 간격
  },
  // 성별 선택 스타일
  genderContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  genderRow: {
    flexDirection: "row",
    gap: 15,
  },
  genderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
    gap: 6,
  },
  genderBtnMaleSelected: {
    borderColor: "#3288FF",
    backgroundColor: "#E8F3FF",
  },
  genderBtnFemaleSelected: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFF0F0",
  },
  genderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#aaa",
  },
  genderTextMale: {
    color: "#3288FF",
  },
  genderTextFemale: {
    color: "#FF6B6B",
  },
  // 하단 링크
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#888",
  },
  loginLink: {
    color: "#3288FF",
    fontWeight: "bold",
  },
});