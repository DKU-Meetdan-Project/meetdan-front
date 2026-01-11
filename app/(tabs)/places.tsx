// 파일: app/(tabs)/places.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { places } from "../../store"; // ✅ store 경로 확인 (../../store 또는 ../../constants/store)

export default function PlacesTab() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    // 클릭 시 상세 페이지로 이동!
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/place/${item.id}` as any)} // 👈 경로 변경
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.overlay} />

      <View style={styles.textContainer}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>제휴 🤝</Text>
          </View>
          <Text style={styles.distance}>
            <Ionicons name="location-sharp" size={12} /> {item.distance}
          </Text>
        </View>

        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.desc}</Text>

        <View style={styles.benefitBox}>
          <Text style={styles.benefitText}>🎁 {item.benefit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>우리 학교 핫플 🔥</Text>
        <Text style={styles.headerSub}>밋단 인증하고 서비스 받으세요!</Text>
      </View>

      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  headerSub: { fontSize: 14, color: "#666" },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 250,
    elevation: 5,
  },
  image: { width: "100%", height: "100%", position: "absolute" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  textContainer: { flex: 1, justifyContent: "flex-end", padding: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  distance: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  desc: { fontSize: 14, color: "#eee", marginBottom: 12, fontWeight: "500" },
  benefitBox: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  benefitText: { color: "#3288FF", fontWeight: "bold", fontSize: 14 },
});
