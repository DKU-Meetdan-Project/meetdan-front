// app/(tabs)/my_team.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
// Store 함수들 불러오기
import { myTeamState, toggleTeamStatus, simulateJoinMember } from "../store";

export default function MyTeamTab() {
  const router = useRouter();
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null); // 어떤 카드를 펼쳤는지

  useFocusEffect(
    useCallback(() => {
      setMyTeams([...myTeamState.myTeams]); // 리스트 새로고침
    }, [])
  );

  // 초대 코드 공유하기
  const onShareCode = async (code: string) => {
    await Share.share({
      message: `[MeetDan] 야, 우리 팀 들어와! 초대코드: ${code}`,
    });
  };

  // 카드 렌더링 함수
  const renderTeamCard = ({ item }: { item: any }) => {
    const isFull = item.currentCount === item.count; // 인원 꽉 찼니?
    const isPublic = item.status === "ACTIVE"; // 공개 중이니?
    const isExpanded = expandedId === item.id; // 현재 펼쳐진 카드니?

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => setExpandedId(isExpanded ? null : item.id)} // 클릭하면 펼치기/접기
      >
        {/* 1. 카드 헤더 (항상 보임) */}
        <View style={styles.cardHeader}>
          <View style={styles.headerTop}>
            <Text style={styles.deptText}>{item.dept}</Text>
            {/* 상태 배지 */}
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
            {item.currentCount} / {item.count}명 참여중 · 평균 {item.age}세
          </Text>
        </View>

        {/* 2. 펼쳐진 디테일 (클릭해야 보임) */}
        {isExpanded && (
          <View style={styles.detailSection}>
            <View style={styles.divider} />

            {/* 초대 코드 영역 */}
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>초대 코드</Text>
              <TouchableOpacity
                style={styles.codeRow}
                onPress={() => onShareCode(item.inviteCode)}
              >
                <Text style={styles.codeText}>{item.inviteCode}</Text>
                <Ionicons name="copy-outline" size={18} color="#666" />
              </TouchableOpacity>
              <Text style={styles.codeDesc}>
                친구에게 이 코드를 알려주세요!
              </Text>
            </View>

            {/* 멤버 리스트 */}
            <Text style={styles.sectionTitle}>
              팀원 현황 ({item.currentCount}/{item.count})
            </Text>
            {item.members.map((m: any, idx: number) => (
              <View key={idx} style={styles.memberRow}>
                <View style={styles.avatar} />
                <Text style={styles.memberName}>
                  {m.name} ({m.role})
                </Text>
              </View>
            ))}

            {/* (테스트용) 친구 들어오게 하기 버튼 */}
            {!isFull && (
              <TouchableOpacity
                style={styles.testJoinButton}
                onPress={() => {
                  simulateJoinMember(item.id);
                  setMyTeams([...myTeamState.myTeams]); // 화면 갱신
                }}
              >
                <Text style={styles.testJoinText}>
                  🧪 (테스트) 친구 입장시키기
                </Text>
              </TouchableOpacity>
            )}

            {/* 공개/비공개 버튼 (인원 다 차야 가능!) */}
            {isFull ? (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isPublic ? styles.bgGray : styles.bgBlue,
                ]}
                onPress={() => {
                  toggleTeamStatus(item.id, !isPublic);
                  setMyTeams([...myTeamState.myTeams]);
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
              <View style={styles.lockedButton}>
                <Text style={styles.lockedText}>
                  🔒 인원이 다 모여야 등록할 수 있어요
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 팀 관리 👑</Text>
        <TouchableOpacity onPress={() => router.push("/write")}>
          <Text style={styles.createBtn}>+ 방 만들기</Text>
        </TouchableOpacity>
      </View>

      {myTeams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>만들어진 방이 없어요.</Text>
        </View>
      ) : (
        <FlatList
          data={myTeams}
          renderItem={renderTeamCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  createBtn: { fontSize: 16, color: "#3288FF", fontWeight: "bold" },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#999", fontSize: 16 },

  // 카드 스타일
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

  // 디테일 영역
  detailSection: { marginTop: 10 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 15 },

  codeBox: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  codeLabel: { fontSize: 12, color: "#888", marginBottom: 5 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  codeText: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#333",
  },
  codeDesc: { fontSize: 12, color: "#aaa", marginTop: 5 },

  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 10 },
  memberRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  memberName: { fontSize: 14, color: "#333" },

  // 버튼들
  testJoinButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  testJoinText: { fontSize: 12, color: "#666" },

  actionButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: { fontWeight: "bold", fontSize: 16 },

  lockedButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  lockedText: { color: "#999", fontSize: 14 },
});
