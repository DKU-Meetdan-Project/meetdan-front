import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { myTeamState, updateTeam } from "../../store"; // store 경로 확인!

export default function EditTeam() {
  const { id } = useLocalSearchParams(); // URL에서 팀 ID 꺼내기
  const router = useRouter();

  // 입력값 상태들
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [age, setAge] = useState("");

  // 화면이 열리면 기존 데이터 채워넣기
  useEffect(() => {
    // ID가 문자열로 넘어오므로 비교를 위해 문자열 변환
    const team = myTeamState.myTeams.find((t) => t.id.toString() === id);

    if (team) {
      setTitle(team.title);
      setContent(team.content || ""); // 소개글 (MBTI 등)
      setAge(team.age.toString());
    } else {
      Alert.alert("오류", "팀 정보를 찾을 수 없습니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    }
  }, [id]);

  // 저장 버튼 클릭 시
  const handleUpdate = () => {
    if (!title || !content || !age) {
      Alert.alert("잠깐!", "내용을 모두 입력해주세요.");
      return;
    }

    // store의 updateTeam 함수 호출
    updateTeam(Number(id), {
      title,
      content,
      age: parseInt(age),
    });

    Alert.alert("수정 완료! ✨", "팀 정보가 변경되었습니다.", [
      { text: "확인", onPress: () => router.back() }, // 뒤로 가기 (내 팀 화면으로)
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>팀 정보 수정</Text>
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={styles.submitText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        {/* 제목 입력 */}
        <Text style={styles.label}>제목 (학과 + 인원)</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="예: 소프트웨어학과 3명"
        />

        {/* 평균 나이 입력 */}
        <Text style={styles.label}>평균 나이</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          placeholder="23"
        />

        {/* 내용 입력 (MBTI, 어필 등) */}
        <Text style={styles.label}>우리 팀 어필 (MBTI, 주량 등)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          multiline={true}
          placeholder="MBTI랑 좋아하는 술 스타일 적어주세요!"
        />
        <Text style={styles.hint}>
          * 여기서 내용을 수정하면 상세 페이지에 바로 반영됩니다.
        </Text>
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
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
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
    padding: 15,
    marginTop: 5,
    borderBottomWidth: 1,
  },
  hint: { marginTop: 10, color: "#888", fontSize: 12 },
});
