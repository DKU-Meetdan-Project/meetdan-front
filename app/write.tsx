// 파일: app/write.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

// ✅ [수정 1] store의 useStore 훅 가져오기
import { useStore, Team } from "../store/useStore";

export default function Write() {
  const router = useRouter();

  // ✅ [수정 2] useStore에서 '내 팀에 추가하는 함수(joinTeam)' 가져오기
  // (이름은 joinTeam이지만 "내 팀 목록에 넣는다"는 기능은 똑같습니다)
  const { joinTeam } = useStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [age, setAge] = useState("");
  const [count, setCount] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // 1. 유효성 검사
    if (!title || !content || !age) {
      Alert.alert("잠깐!", "제목, 내용, 나이를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ [수정 3] Team 객체 완벽하게 조립하기
      // (store.ts가 없으므로 여기서 id랑 코드를 만들어줘야 함)
      const newTeam: Team = {
        id: Date.now(), // 고유 ID 생성
        title: title,
        content: content,
        age: parseInt(age),
        count: count,
        currentCount: 1, // 방장이니까 1명부터 시작
        dept: "소프트웨어학과", // (나중에 로그인 정보로 대체)
        gender: "M", // (나중에 로그인 정보로 대체)
        campus: "죽전",
        tags: ["#신규", "#설렘"],
        status: "RECRUITING", // 모집중 상태
        timestamp: "방금 전",
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(), // 랜덤 초대코드 생성 (예: X7A9Z)
        members: [{ name: "나(팀장)", role: "LEADER" }],
      };

      // 2. 스토어에 저장 (Zustand)
      joinTeam(newTeam);

      // 3. 성공 알림 및 이동
      Alert.alert(
        "방 생성 완료! 🏠",
        "내 팀 관리 탭에서 초대 코드를 확인하세요.",
        [
          {
            text: "확인",
            onPress: () => router.replace("/(tabs)/my_team"),
          },
        ],
      );
    } catch (error) {
      Alert.alert("오류", "방 생성 중 문제가 발생했습니다.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>팀 만들기</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#3288FF" />
          ) : (
            <Text style={styles.submitText}>완료</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        {/* 인원수 선택 */}
        <Text style={styles.label}>몇 명이서 나가나요?</Text>
        <View style={styles.countContainer}>
          {[2, 3, 4].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.countButton,
                count === num && styles.countButtonActive,
              ]}
              onPress={() => setCount(num)}
            >
              <Text
                style={[
                  styles.countText,
                  count === num && styles.countTextActive,
                ]}
              >
                {num}:{num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 평균 나이 */}
        <Text style={styles.label}>평균 나이는?</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 23"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          maxLength={2}
        />

        {/* 제목 */}
        <Text style={styles.label}>제목 (임팩트 있게!)</Text>
        <TextInput
          style={styles.input}
          placeholder="소프트웨어학과 3명 술 진탕 마셔요"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        {/* 어필 내용 */}
        <Text style={styles.label}>우리 팀 매력 어필</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="MBTI, 주량, 분위기 등 자유롭게 적어주세요."
          placeholderTextColor="#999"
          multiline={true}
          value={content}
          onChangeText={setContent}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  cancelText: { fontSize: 16, color: "#666" },
  submitText: { fontSize: 16, fontWeight: "bold", color: "#3288FF" },
  formContainer: { padding: 20 },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    color: "#333",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    borderBottomWidth: 1,
  },
  countContainer: { flexDirection: "row", gap: 10 },
  countButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  countButtonActive: { backgroundColor: "#E8F3FF", borderColor: "#3288FF" },
  countText: { fontSize: 16, color: "#888", fontWeight: "bold" },
  countTextActive: { color: "#3288FF" },
});
