// app/post/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 경로 확인 (store에서 데이터 가져오기)
import { posts, myTeamState, sendMatchRequest } from "../store";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // 1. URL로 넘어온 id로 상대방 팀 정보 찾기
  const targetPost = posts.find((p) => p.id.toString() === id);

  // 2. 내 팀 선택 모달 상태
  const [modalVisible, setModalVisible] = useState(false);

  if (!targetPost) {
    return (
      <View style={styles.center}>
        <Text>삭제된 게시글입니다.</Text>
      </View>
    );
  }

  // 3. 신청 버튼 눌렀을 때 로직
  const handlePressRequest = () => {
    // 내 팀이 하나도 없으면?
    if (myTeamState.myTeams.length === 0) {
      Alert.alert("팀이 없어요!", "먼저 [내 팀] 탭에서 팀을 만들어주세요.");
      return;
    }
    // 팀이 있으면 모달 열어서 선택하게 함
    setModalVisible(true);
  };

  // 4. 진짜 전송 (내 팀 선택 완료)
  const confirmRequest = (myTeam: any) => {
    setModalVisible(false); // 모달 닫기

    // 인원수 체크 (예: 3:3 미팅인데 2명 팀으로 신청하면?)
    if (myTeam.count !== targetPost.count) {
      Alert.alert(
        "인원수 불일치",
        `상대방은 ${targetPost.count}명을 원해요! (우리팀: ${myTeam.count}명)`
      );
      return;
    }

    // 스토어 함수 호출
    const success = sendMatchRequest(myTeam.id, targetPost.id);

    if (success) {
      Alert.alert("신청 완료! 💌", "상대방이 수락하면 채팅방이 열립니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- 게시글 내용 --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.dept}>{targetPost.dept}</Text>
          <Text style={styles.title}>{targetPost.title}</Text>
          <View style={styles.tags}>
            {targetPost.tags.map((tag: string, i: number) => (
              <Text key={i} style={styles.tagText}>
                {tag}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📍 인원: {targetPost.count}명</Text>
          <Text style={styles.infoText}>🎂 평균 나이: {targetPost.age}세</Text>
          <Text style={styles.infoText}>
            👫 성별: {targetPost.gender === "F" ? "여자" : "남자"}
          </Text>
        </View>

        <Text style={styles.content}>{targetPost.content}</Text>
      </ScrollView>

      {/* --- 하단 고정 신청 버튼 --- */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={handlePressRequest}
        >
          <Text style={styles.reqBtnText}>이 팀에게 과팅 신청하기 👋</Text>
        </TouchableOpacity>
      </View>

      {/* --- 🌟 [모달] 내 팀 선택하기 --- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>어떤 팀으로 신청할까요?</Text>
            <Text style={styles.modalSub}>
              우리 팀 목록 ({myTeamState.myTeams.length}개)
            </Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {myTeamState.myTeams.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  style={styles.teamSelectCard}
                  onPress={() => confirmRequest(team)}
                >
                  <View>
                    <Text style={styles.teamSelectTitle}>{team.title}</Text>
                    <Text style={styles.teamSelectInfo}>
                      {team.count}명 ·{" "}
                      {team.status === "ACTIVE" ? "공개중" : "비공개"}
                    </Text>
                  </View>
                  <Text style={styles.selectArrow}>선택 👉</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingBottom: 100 },

  header: { marginBottom: 20, marginTop: 40 },
  dept: { color: "#3288FF", fontWeight: "bold", marginBottom: 5 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  tags: { flexDirection: "row", gap: 8 },
  tagText: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: "#666",
    fontSize: 12,
  },

  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: { fontSize: 14, fontWeight: "bold", color: "#333" },

  content: { fontSize: 16, lineHeight: 24, color: "#333" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  requestButton: {
    backgroundColor: "#3288FF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  reqBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  modalSub: { fontSize: 14, color: "#888", marginBottom: 20 },

  teamSelectCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
  },
  teamSelectTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  teamSelectInfo: { fontSize: 12, color: "#666" },
  selectArrow: { color: "#3288FF", fontWeight: "bold" },

  closeBtn: { marginTop: 10, padding: 15, alignItems: "center" },
  closeText: { color: "#666", fontWeight: "bold" },
});
