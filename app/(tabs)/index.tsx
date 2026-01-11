// 파일 경로: app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { posts } from "../store"; // store에서 데이터 가져오기

export default function HomeTab() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);

  // 화면이 포커스될 때마다 데이터 새로고침 (ACTIVE인 글만)
  useFocusEffect(
    useCallback(() => {
      const activePosts = posts.filter((p) => p.status === "ACTIVE");
      setData([...activePosts]);
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => {
    <TouchableOpacity
      style={styles.card}
      // 👇 클릭 시 상세 페이지로 이동 (id 전달)
      onPress={() => router.push(`/post/${item.id}`)}
    >
      {" "}
    </TouchableOpacity>;
    const isMale = item.gender === "M";
    const pointColor = isMale ? "#3288FF" : "#FF6B6B";
    const iconName = isMale ? "male" : "female";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/post/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.deptBadge}>
            <Text style={styles.deptText}>{item.dept}</Text>
          </View>
          <Text style={styles.timeText}>{item.timestamp}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.infoRow}>
          <View
            style={[
              styles.infoBadge,
              { backgroundColor: isMale ? "#E8F3FF" : "#FFF0F0" },
            ]}
          >
            <Ionicons
              name={iconName}
              size={14}
              color={pointColor}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.infoText, { color: pointColor }]}>
              {item.count}명 · 평균 {item.avgAge}세
            </Text>
          </View>
        </View>

        <View style={styles.tagRow}>
          {item.tags &&
            item.tags.map((tag: string, index: number) => (
              <Text key={index} style={styles.tagText}>
                {tag}
              </Text>
            ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MeetDan 🔥</Text>
        {/* 여기 있던 '글쓰기' 버튼은 하단 탭으로 이동했으므로 삭제하거나 알림 버튼으로 대체 */}
        <TouchableOpacity
          onPress={() => router.push("/temp/temp_notification")}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text style={{ color: "#999", marginBottom: 10 }}>
                등록된 과팅이 없습니다.
              </Text>
              <Text style={{ color: "#999" }}>
                아래 '방 만들기' 탭에서 직접 만들어보세요!
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
  content: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  deptBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deptText: { fontSize: 12, color: "#666", fontWeight: "600" },
  timeText: { fontSize: 12, color: "#aaa" },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
    lineHeight: 24,
  },
  infoRow: { flexDirection: "row", marginBottom: 12 },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  infoText: { fontSize: 13, fontWeight: "bold" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagText: { fontSize: 13, color: "#888" },
});
