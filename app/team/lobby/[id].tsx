// 파일 경로: app/team/lobby/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 경로 수정: ../../store 가 아니라 ../../../store 일 수도 있음.
// 에러가 계속 나면 경로를 확인해주세요. (현재는 app/store.ts를 바라보게 설정)

export default function TeamLobby() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // 새로 만든 팀 ID

  const inviteCode = "NEW-TEAM-01"; // (임시) 초대 코드

  // 내 팀 멤버 상태
  const [members, setMembers] = useState([
    { name: "나 (팀장)", dept: "소프트", status: "READY", avatar: "person" },
    { name: "친구 대기중...", dept: "-", status: "WAITING", avatar: "add" },
    { name: "친구 대기중...", dept: "-", status: "WAITING", avatar: "add" },
  ]);

  const isReady = members.every((m) => m.status === "READY");
  const currentCount = members.filter((m) => m.status === "READY").length;

  // [테스트용] 친구 입장 시뮬레이션
  const simulateFriendJoin = () => {
    const emptyIndex = members.findIndex((m) => m.status === "WAITING");
    if (emptyIndex === -1) return;

    const newMembers = [...members];
    newMembers[emptyIndex] = {
      name: `친구 ${emptyIndex + 1}`,
      dept: "컴공",
      status: "READY",
      avatar: "person-outline",
    };
    setMembers(newMembers);
  };

  const handleComplete = () => {
    // 여기서 store.ts의 addPost를 호출하거나, 백엔드로 상태 변경 요청
    // 예시: addPost({ ... });
    Alert.alert("팀 등록 완료! 🎉", "이제 메인 화면에 우리 팀이 노출됩니다.");
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>팀 구성하기 (1/3)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleArea}>
          <Text style={styles.mainTitle}>
            친구들이 들어오면{"\n"}글이 등록됩니다!
          </Text>
          <Text style={styles.subTitle}>아래 코드를 친구에게 공유하세요.</Text>
        </View>

        {/* 초대 코드 */}
        <TouchableOpacity
          style={styles.codeCard}
          onPress={() => Alert.alert("복사됨")}
        >
          <Text style={styles.codeLabel}>초대 코드</Text>
          <Text style={styles.codeText}>{inviteCode}</Text>
          <Text style={styles.codeDesc}>터치해서 복사하기</Text>
        </TouchableOpacity>

        {/* 멤버 슬롯 */}
        <View style={styles.memberGrid}>
          {members.map((member, index) => (
            <View key={index} style={styles.memberSlot}>
              <View
                style={[
                  styles.avatarCircle,
                  member.status === "WAITING" && styles.waitingCircle,
                ]}
              >
                <Ionicons
                  name={member.avatar as any}
                  size={30}
                  color={member.status === "READY" ? "#fff" : "#ccc"}
                />
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
          ))}
        </View>

        {/* [테스트 버튼] */}
        {!isReady && (
          <TouchableOpacity
            style={styles.testButton}
            onPress={simulateFriendJoin}
          >
            <Text style={styles.testButtonText}>
              🛠 (개발용) 친구 입장시키기
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.actionButton, !isReady && styles.disabledButton]}
          disabled={!isReady}
          onPress={handleComplete}
        >
          <Text style={styles.actionButtonText}>
            {isReady
              ? "팀 등록하기 (공개)"
              : `${3 - currentCount}명 더 모여야 해요`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 스타일 정의 (이게 빠져서 에러가 났던 겁니다!)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  content: { padding: 24, alignItems: "center" },
  titleArea: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
    lineHeight: 30,
  },
  subTitle: { fontSize: 15, color: "#888", textAlign: "center" },
  codeCard: {
    width: "100%",
    backgroundColor: "#F5F7FB",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 40,
  },
  codeLabel: { fontSize: 14, color: "#666", marginBottom: 5 },
  codeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3288FF",
    letterSpacing: 2,
    marginBottom: 5,
  },
  codeDesc: { fontSize: 12, color: "#999" },
  memberGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  memberSlot: { alignItems: "center", width: "30%" },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#3288FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  waitingCircle: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  memberName: { fontSize: 14, fontWeight: "bold", color: "#333" },
  testButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  testButtonText: { fontSize: 12, color: "#555" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingBottom: 30,
  },
  actionButton: {
    backgroundColor: "#3288FF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#ddd" },
  actionButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
