// 파일: app/(tabs)/history.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { useStore, Team, Match } from "../../store/useStore";

// 탭 타입 정의
type TabType = "RECEIVED" | "SENT" | "MATCHES";

export default function HistoryTab() {
  const router = useRouter();
  const { receivedRequests, sentRequests, posts, matches } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>("RECEIVED");

  // 1. [받은 신청] 데이터 가공
  const receivedList = receivedRequests.map((req) => {
    const senderTeam = posts.find((p) => p.id === req.senderTeamId);
    return { ...req, teamInfo: senderTeam, type: "RECEIVED" };
  });

  // 2. [보낸 신청] 데이터 가공
  const sentList = sentRequests.map((req) => {
    const receiverTeam = posts.find((p) => p.id === req.receiverTeamId);
    return { ...req, teamInfo: receiverTeam, type: "SENT" };
  });

  // 공통 렌더링 (신청서용)
  const renderRequestItem = ({ item }: { item: any }) => {
    const team: Team = item.teamInfo;
    if (!team) return null;

    const isReceived = item.type === "RECEIVED";
    const statusText = isReceived
      ? "💌 과팅 신청이 도착했습니다!"
      : "⏳ 상대방의 수락을 기다리고 있어요.";
    const statusColor = isReceived ? "#3288FF" : "#888";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          isReceived && router.push(`/match/party/${team.id}` as any)
        }
        activeOpacity={isReceived ? 0.7 : 1}
      >
        <View style={styles.cardRow}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarPlaceholder,
                !isReceived && { backgroundColor: "#f5f5f5" },
              ]}
            >
              <Text style={styles.avatarText}>{team.title[0]}</Text>
            </View>
            {isReceived && <View style={styles.newBadge} />}
          </View>

          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Text style={styles.teamName}>{team.title}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <Text style={styles.subInfo}>
              {team.dept} · {team.count}명
            </Text>
            <Text style={styles.message} numberOfLines={1}>
              {isReceived
                ? "얼른 확인하고 수락해보세요!"
                : "매칭이 성사되면 알림을 드릴게요."}
            </Text>
          </View>
          {isReceived && (
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          )}
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
          {isReceived && <Text style={styles.actionText}>확인하기</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  // 매칭 렌더링 (매칭용)
  const renderMatchItem = ({ item }: { item: Match }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/chat/${item.id}` as any)}
    >
      <View style={styles.cardRow}>
        <View
          style={[styles.avatarPlaceholder, { backgroundColor: "#E8F3FF" }]}
        >
          <Ionicons name="chatbubbles" size={20} color="#3288FF" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.teamName}>{item.partnerTeamName}</Text>
          <Text style={styles.subInfo}>매칭 날짜: {item.startedAt}</Text>
        </View>
        <View style={styles.chatBadge}>
          <Text style={styles.chatBadgeText}>채팅중</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>활동 내역</Text>
      </View>

      <View style={styles.tabContainer}>
        {(["RECEIVED", "SENT", "MATCHES"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "RECEIVED" && `받은 신청 ${receivedList.length}`}
              {tab === "SENT" && `보낸 신청 ${sentList.length}`}
              {tab === "MATCHES" && `매칭 ${matches.length}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ [핵심 수정] 탭에 따라 아예 다른 FlatList를 렌더링해서 타입 충돌 방지 */}
      <View style={styles.listContainer}>
        {activeTab === "MATCHES" ? (
          // 매칭 목록일 때
          <FlatList
            data={matches}
            renderItem={renderMatchItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20 }}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>성사된 매칭이 없습니다.</Text>
              </View>
            }
          />
        ) : (
          // 받은/보낸 신청 목록일 때
          <FlatList
            data={activeTab === "RECEIVED" ? receivedList : sentList}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20 }}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>내역이 없습니다.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  tabButton: {
    paddingVertical: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: { borderBottomColor: "#333" },
  tabText: { fontSize: 15, color: "#999", fontWeight: "bold" },
  activeTabText: { color: "#333" },
  listContainer: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  avatarContainer: { position: "relative" },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: "#666" },
  newBadge: {
    position: "absolute",
    top: 0,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  cardContent: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  teamName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  timestamp: { fontSize: 12, color: "#aaa" },
  subInfo: { fontSize: 13, color: "#666", marginBottom: 4 },
  message: { fontSize: 13, color: "#888" },
  statusRow: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusText: { fontSize: 13, fontWeight: "bold" },
  actionText: { fontSize: 13, color: "#999" },
  emptyBox: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", fontSize: 16 },
  chatBadge: {
    backgroundColor: "#E8F3FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chatBadgeText: { fontSize: 11, color: "#3288FF", fontWeight: "bold" },
});
