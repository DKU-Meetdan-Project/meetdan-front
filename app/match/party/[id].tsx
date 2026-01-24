// 파일: app/match/party/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { useStore, Team } from "../../../store/useStore";

export default function MatchPartyDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { posts } = useStore(); // 실제로는 '요청 온 팀 목록'에서 찾아야 하지만, 지금은 전체 팀에서 찾음
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    // ID로 팀 정보 찾기
    const target = posts.find((p) => p.id.toString() === id);
    if (target) {
      setTeam(target);
    } else {
      // (테스트용) 데이터가 없으면 가짜 데이터라도 보여줌
      setTeam({
        id: 999,
        title: "데이터를 찾을 수 없음",
        campus: "죽전",
        dept: "알 수 없음",
        gender: "F",
        status: "ACTIVE",
        content: "삭제되었거나 존재하지 않는 팀입니다.",
        count: 3,
        currentCount: 3,
        age: 20,
        timestamp: "Now",
        tags: [],
        members: [],
      });
    }
  }, [id, posts]);

  if (!team) return null;

  const isMale = team.gender === "M";
  const themeColor = isMale ? "#3288FF" : "#FF6B6B";
  const bgBadgeColor = isMale ? "#E8F3FF" : "#FFF0F0";

  // 수락 핸들러
  const handleAccept = () => {
    Alert.alert(
      "매칭 수락 💖",
      "채팅방이 생성되었습니다! 대화를 시작해보세요.",
      [
        {
          text: "채팅방으로 이동",
          // 채팅방 ID는 팀 ID를 따라간다고 가정
          onPress: () => router.replace(`/chat/${team.id}` as any),
        },
      ],
    );
  };

  // 거절 핸들러
  const handleReject = () => {
    Alert.alert("거절하시겠습니까?", "이 팀의 요청을 삭제합니다.", [
      { text: "취소", style: "cancel" },
      {
        text: "거절하기",
        style: "destructive",
        onPress: () => {
          // TODO: store에서 요청 삭제 로직 호출
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 1. 헤더 (뒤로가기) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상대 팀 프로필</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* 2. 팀 요약 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }} // 나중엔 실제 프사
              style={styles.avatar}
            />
            <View style={[styles.genderBadge, { backgroundColor: themeColor }]}>
              <Ionicons
                name={isMale ? "male" : "female"}
                size={12}
                color="#fff"
              />
            </View>
          </View>

          <Text style={styles.teamTitle}>{team.title}</Text>

          <View style={styles.badgeRow}>
            {/* 캠퍼스 뱃지 */}
            <View
              style={[
                styles.infoBadge,
                {
                  backgroundColor:
                    team.campus === "죽전" ? "#E8F3FF" : "#E8F5E9",
                },
              ]}
            >
              <Text
                style={[
                  styles.infoText,
                  { color: team.campus === "죽전" ? "#3288FF" : "#00C853" },
                ]}
              >
                {team.campus}
              </Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.summaryText}>
              {team.dept} · {team.age}년생 ({team.age}세)
            </Text>
          </View>
        </View>

        {/* 3. 팀 소개글 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 우리 팀을 소개합니다</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{team.content}</Text>
            <View style={styles.tagRow}>
              {team.tags?.map((tag, i) => (
                <Text key={i} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* 4. 멤버 상세 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            👥 멤버 구성 ({team.currentCount}/{team.count})
          </Text>

          {/* 리더 */}
          <View style={styles.memberRow}>
            <View style={styles.memberIcon}>
              <Text style={styles.memberEmoji}>👑</Text>
            </View>
            <View>
              <Text style={styles.memberName}>
                {team.members?.[0]?.name || "팀장"} (본인)
              </Text>
              <Text style={styles.memberInfo}>
                {team.dept} · {team.gender === "M" ? "남자" : "여자"}
              </Text>
            </View>
          </View>

          {/* 팀원들 (목업 데이터 - 실제로는 members 배열을 map으로 돌려야 함) */}
          {[...Array(team.count - 1)].map((_, i) => (
            <View key={i} style={styles.memberRow}>
              <View style={[styles.memberIcon, { backgroundColor: "#f0f0f0" }]}>
                <Text style={styles.memberEmoji}>🙂</Text>
              </View>
              <View>
                <Text style={styles.memberName}>팀원 {i + 1}</Text>
                <Text style={styles.memberInfo}>{team.dept} · 정보 비공개</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 5. 하단 고정 액션 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
          <Text style={styles.rejectText}>거절하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.acceptBtn, { backgroundColor: themeColor }]}
          onPress={handleAccept}
        >
          <Text style={styles.acceptText}>수락하고 채팅하기</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  backBtn: { padding: 4 },

  profileCard: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 8,
    borderBottomColor: "#F5F7FB",
  },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  genderBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  teamTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  infoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  infoText: { fontSize: 13, fontWeight: "bold" },
  divider: { width: 1, height: 12, backgroundColor: "#ddd", marginRight: 8 },
  summaryText: { fontSize: 15, color: "#666" },

  section: { padding: 25, borderBottomWidth: 1, borderBottomColor: "#eee" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  contentBox: { backgroundColor: "#F9FAFB", padding: 20, borderRadius: 12 },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 15,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 13,
    color: "#666",
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },

  memberRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  memberIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF9C4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberEmoji: { fontSize: 20 },
  memberName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  memberInfo: { fontSize: 13, color: "#888", marginTop: 2 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  rejectText: { fontSize: 16, fontWeight: "bold", color: "#666" },
  acceptBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});
