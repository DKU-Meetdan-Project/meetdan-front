// 파일: app/(tabs)/my_team.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

// ✅ [핵심 변경] store 폴더의 store.ts가 아니라 useStore.ts를 가져옵니다.
import { useStore, Team } from "../../store/useStore";

export default function MyTeamTab() {
  const router = useRouter();

  // ✅ [Zustand Hook 사용]
  // useState로 관리하던 myTeams, sentRequests를 여기서 바로 꺼내 씁니다.
  // 액션 함수들도 여기서 바로 가져옵니다.
  const {
    myTeams,
    sentRequests,
    deleteTeam,
    joinTeamByCode,
    toggleTeamStatus,
    simulateJoinMember,
  } = useStore();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);

  // 초대 코드 입력 모달 상태
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [inputCode, setInputCode] = useState("");

  // 🚨 [삭제됨] useFocusEffect 더 이상 필요 없음! (Zustand가 알아서 화면 갱신해줌)

  // 팀 삭제 핸들러
  const handleDelete = (id: number) => {
    Alert.alert(
      "팀 삭제 🗑️",
      "정말 이 팀을 삭제하시겠습니까?\n(되돌릴 수 없습니다)",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            deleteTeam(id); // ✅ 스토어 함수 호출
          },
        },
      ],
    );
  };

  // 초대 코드로 팀 참가 핸들러
  const handleJoinTeam = () => {
    if (inputCode.length < 1) {
      Alert.alert("잠깐!", "초대 코드를 입력해주세요.");
      return;
    }

    const success = joinTeamByCode(inputCode); // ✅ 스토어 함수 호출
    if (success) {
      setJoinModalVisible(false);
      setInputCode("");
      Alert.alert("참가 완료! 🤝", `친구 팀(${inputCode})에 합류했습니다.`);
    } else {
      Alert.alert("오류", "코드가 올바르지 않거나 이미 가입된 팀입니다.");
    }
  };

  // 팀 카드 렌더링
  const renderTeamCard = ({ item }: { item: Team }) => {
    const isFull = item.currentCount >= item.count;
    const isPublic = item.status === "ACTIVE";
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        {/* 헤더 부분 */}
        <View style={styles.cardHeader}>
          <View style={styles.headerTop}>
            <Text style={styles.deptText}>{item.dept}</Text>
            <View
              style={[
                styles.badge,
                isPublic
                  ? styles.bgBlue
                  : isFull
                    ? styles.bgGreen
                    : styles.bgGray,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isPublic
                    ? styles.textWhite
                    : isFull
                      ? styles.textWhite
                      : styles.textGray,
                ]}
              >
                {isPublic ? "🔥 공개중" : isFull ? "✅ 준비완료" : "⏳ 모집중"}
              </Text>
            </View>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.info}>
            {item.currentCount}/{item.count}명 · {item.age}세
          </Text>
        </View>

        {/* 펼쳐진 디테일 */}
        {isExpanded && (
          <View style={styles.detailSection}>
            <View style={styles.divider} />

            {/* 관리 버튼 */}
            <View style={styles.manageRow}>
              <TouchableOpacity
                style={styles.manageBtn}
                onPress={() => router.push(`/edit/${item.id}` as any)}
              >
                <Ionicons name="pencil" size={16} color="#666" />
                <Text style={styles.manageText}>정보 수정</Text>
              </TouchableOpacity>

              <View style={styles.verticalLine} />

              <TouchableOpacity
                style={styles.manageBtn}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash" size={16} color="#FF5252" />
                <Text style={[styles.manageText, { color: "#FF5252" }]}>
                  팀 삭제
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>
              초대 코드: {item.inviteCode || "없음"}
            </Text>

            {isFull ? (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isPublic ? styles.bgGray : styles.bgBlue,
                ]}
                onPress={() => {
                  toggleTeamStatus(item.id, !isPublic); // ✅ 스토어 함수 호출
                }}
              >
                <Text
                  style={[
                    styles.actionText,
                    isPublic ? styles.textBlack : styles.textWhite,
                  ]}
                >
                  {isPublic ? "🔒 비공개로 돌리기" : "📢 게시판에 등록하기"}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.lockedText}>
                🔒 친구가 다 모여야 공개할 수 있어요
              </Text>
            )}

            {/* 테스트용 버튼 */}
            {!isFull && (
              <TouchableOpacity
                onPress={() => {
                  simulateJoinMember(item.id); // ✅ 스토어 함수 호출
                }}
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: "blue", textAlign: "center" }}>
                  🧪 (테스트) 친구 입장시키기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 팀 관리 👑</Text>
      </View>

      {/* 상단 배너 */}
      <View style={styles.bannerContainer}>
        <TouchableOpacity
          style={[styles.bannerBtn, styles.bannerBtnGray]}
          onPress={() => setJoinModalVisible(true)}
        >
          <Ionicons name="ticket-outline" size={20} color="#666" />
          <Text style={styles.bannerTextGray}>코드 입력</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bannerBtn, styles.bannerBtnBlue]}
          onPress={() => router.push("/write")}
        >
          <Ionicons name="add" size={20} color="#3288FF" />
          <Text style={styles.bannerTextBlue}>방 만들기</Text>
        </TouchableOpacity>
      </View>

      {/* 팀 리스트 */}
      <FlatList
        data={myTeams}
        renderItem={renderTeamCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 만든 팀이 없어요!</Text>
          </View>
        }
      />

      {/* 모달 2: 초대코드 입력 */}
      <Modal
        visible={joinModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.joinCard}>
            <Text style={styles.joinTitle}>🎫 초대 코드 입력</Text>
            <Text style={styles.joinDesc}>
              친구에게 받은 코드를 입력하세요.
            </Text>

            <TextInput
              style={styles.codeInput}
              placeholder="예: X7A9Z2"
              value={inputCode}
              onChangeText={setInputCode}
              autoCapitalize="characters"
              maxLength={6}
            />

            <View style={styles.joinBtnRow}>
              <TouchableOpacity
                style={styles.joinBtnCancel}
                onPress={() => setJoinModalVisible(false)}
              >
                <Text style={styles.joinBtnTextGray}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.joinBtnConfirm}
                onPress={handleJoinTeam}
              >
                <Text style={styles.joinBtnTextWhite}>입장하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // 스타일은 기존과 동일하므로 그대로 유지하면 됩니다.
  container: { flex: 1, backgroundColor: "#F5F7FB" },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  bannerContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 15,
  },
  bannerBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  bannerBtnBlue: {
    backgroundColor: "#E8F3FF",
    borderWidth: 1,
    borderColor: "#3288FF",
    borderStyle: "dashed",
  },
  bannerBtnGray: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bannerTextBlue: { color: "#3288FF", fontWeight: "bold" },
  bannerTextGray: { color: "#666", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    padding: 20,
    elevation: 2,
  },
  cardHeader: {},
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  deptText: { color: "#888", fontSize: 14 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: "bold" },
  bgBlue: { backgroundColor: "#3288FF" },
  bgGreen: { backgroundColor: "#4CAF50" },
  bgGray: { backgroundColor: "#F5F5F5" },
  textWhite: { color: "#fff" },
  textGray: { color: "#888" },
  textBlack: { color: "#333" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  info: { fontSize: 14, color: "#555" },
  detailSection: { marginTop: 10 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  manageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  manageBtn: { flexDirection: "row", alignItems: "center", gap: 5, padding: 5 },
  manageText: { fontSize: 14, color: "#666", fontWeight: "bold" },
  verticalLine: { width: 1, height: 20, backgroundColor: "#eee" },
  actionButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: { fontWeight: "bold", fontSize: 16 },
  lockedText: {
    color: "#999",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999" },
  modalContainer: { flex: 1, backgroundColor: "#F5F7FB" },
  modalHeader: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  closeText: { fontSize: 16, color: "#3288FF" },
  emptyHistory: { flex: 1, justifyContent: "center", alignItems: "center" },
  historyCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  historyTarget: { fontSize: 16, fontWeight: "bold", color: "#333" },
  historyDate: { fontSize: 12, color: "#aaa" },
  historyMyTeam: { fontSize: 14, color: "#666" },
  historyStatus: {
    fontSize: 14,
    color: "#3288FF",
    fontWeight: "bold",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  joinCard: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  joinTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  joinDesc: { fontSize: 14, color: "#888", marginBottom: 20 },
  codeInput: {
    width: "100%",
    backgroundColor: "#F5F7FB",
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 20,
  },
  joinBtnRow: { flexDirection: "row", gap: 10, width: "100%" },
  joinBtnCancel: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
  },
  joinBtnConfirm: {
    flex: 1,
    padding: 15,
    backgroundColor: "#3288FF",
    borderRadius: 10,
    alignItems: "center",
  },
  joinBtnTextGray: { color: "#666", fontWeight: "bold" },
  joinBtnTextWhite: { color: "#fff", fontWeight: "bold" },
});
