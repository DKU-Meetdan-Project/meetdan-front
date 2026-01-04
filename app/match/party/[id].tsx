// 파일 경로: app/match/party/[id].tsx
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

export default function MatchPartyLobby() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // 신청하려는 상대 팀 ID

  const inviteCode = "FIGHT-8282"; // (임시) 파티 코드

  const [members, setMembers] = useState([
    { name: "나 (파티장)", dept: "소프트", status: "READY", avatar: "person" },
    { name: "친구 대기중...", dept: "-", status: "WAITING", avatar: "add" },
    { name: "친구 대기중...", dept: "-", status: "WAITING", avatar: "add" },
  ]);

  const isReady = members.every((m) => m.status === "READY");
  const currentCount = members.filter((m) => m.status === "READY").length;

  const simulateFriendJoin = () => {
    const emptyIndex = members.findIndex((m) => m.status === "WAITING");
    if (emptyIndex === -1) return;
    const newMembers = [...members];
    newMembers[emptyIndex] = {
      name: `파티원 ${emptyIndex + 1}`,
      dept: "체육",
      status: "READY",
      avatar: "person-outline",
    };
    setMembers(newMembers);
  };

  const handleRequest = () => {
    // 백엔드로 신청서 전송 (POST /api/match/request)

    // Alert에 버튼 옵션을 추가해서, '확인'을 눌러야만 이동하도록 변경
    Alert.alert(
      "신청 성공! 💌", // 제목
      "상대방이 수락하면 채팅방이 열립니다.", // 내용
      [
        {
          text: "확인", // 버튼 이름
          onPress: () => {
            // 확인 버튼을 눌렀을 때 실행될 코드
            // 탭이 있는 메인 화면으로 가려면 '/(tabs)' 경로 이동
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>매칭 파티 꾸리기</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleArea}>
          <Text style={styles.mainTitle}>
            함께 나갈 친구를{"\n"}초대해주세요!
          </Text>
          <Text style={styles.subTitle}>
            인원이 다 모여야 신청서를 보낼 수 있어요.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.codeCard}
          onPress={() => Alert.alert("복사됨")}
        >
          <Text style={styles.codeLabel}>파티 초대 코드</Text>
          <Text style={styles.codeText}>{inviteCode}</Text>
          <Text style={styles.codeDesc}>터치해서 복사하기</Text>
        </TouchableOpacity>

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

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.actionButton, !isReady && styles.disabledButton]}
          disabled={!isReady}
          onPress={handleRequest}
        >
          <Text style={styles.actionButtonText}>
            {isReady ? "상대팀에게 신청 보내기 🚀" : "친구 기다리는 중..."}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ✅ 공통 스타일 (두 파일 모두 맨 아래에 붙여넣으세요)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
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
