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

// 🚨 [수정 포인트 1] import { places } ... 삭제! (파일 내부에 직접 정의함)

// ✅ [수정 포인트 2] 잃어버린 places 데이터 복구
const places = [
  {
    id: "1",
    name: "단국포차",
    desc: "안주가 맛있는 감성 포차",
    benefit: "소주 1병 서비스",
    distance: "150m",
    image: "https://via.placeholder.com/300", // 실제 이미지 URL로 나중에 바꾸세요
  },
  {
    id: "2",
    name: "죽전 회관",
    desc: "학생증 제시 시 사이즈 업",
    benefit: "음료수 무한리필",
    distance: "300m",
    image: "https://via.placeholder.com/300",
  },
  {
    id: "3",
    name: "코인 노래방",
    desc: "시설 좋은 럭셔리 코노",
    benefit: "1곡 서비스",
    distance: "50m",
    image: "https://via.placeholder.com/300",
  },
];

export default function PlacesTab() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/place/${item.id}` as any)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover" // 이미지 꽉 차게
      />
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
    // iOS 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: { width: "100%", height: "100%", position: "absolute" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)", // 글씨 잘 보이게 조금 더 어둡게 수정
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
