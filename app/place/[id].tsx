// 파일 경로: app/place/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { places } from "../../store"; // ✅ store 데이터 가져오기

export default function PlaceDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const place = places.find((p) => p.id === id);

  const [modalVisible, setModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [code, setCode] = useState("");

  if (!place)
    return (
      <View>
        <Text>존재하지 않는 가게입니다.</Text>
      </View>
    );

  const checkCode = () => {
    if (code === "1234") {
      setModalVisible(false);
      setSuccessVisible(true);
    } else {
      Alert.alert("땡!", "사장님께 코드를 다시 확인해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 이미지 헤더 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={{ uri: place.image }} style={styles.headerImage} />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{place.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>제휴중</Text>
            </View>
          </View>
          <Text style={styles.desc}>{place.desc}</Text>

          {/* 혜택 박스 */}
          <View style={styles.benefitBox}>
            <Text style={styles.benefitTitle}>🎁 밋단 회원 혜택</Text>
            <Text style={styles.benefitText}>{place.benefit}</Text>
          </View>

          {/* 상세 정보 */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{place.phone}</Text>
              <TouchableOpacity style={styles.copyBtn}>
                <Text style={styles.copyText}>복사</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{place.distance}</Text>
            </View>
          </View>

          {/* 추천 메뉴 */}
          <Text style={styles.sectionTitle}>사장님 추천 메뉴 👩‍🍳</Text>
          <View style={styles.menuList}>
            {place.bestMenu.map((menu, i) => (
              <View key={i} style={styles.menuItem}>
                <Text style={styles.menuText}>• {menu}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.actionButtonText}>
            비밀번호 입력하고 서비스 받기
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---- 모달들은 places.tsx에서 가져옴 (코드 재사용) ---- */}
      {/* 1. 입력 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>사장님 코드 입력</Text>
            <Text style={styles.modalDesc}>
              사장님께 비밀번호를 물어보세요!
            </Text>
            <TextInput
              style={styles.input}
              placeholder="1234"
              keyboardType="number-pad"
              maxLength={4}
              value={code}
              onChangeText={setCode}
              autoFocus
            />
            <TouchableOpacity style={styles.confirmBtn} onPress={checkCode}>
              <Text style={styles.confirmBtnText}>인증하기</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 2. 성공 모달 */}
      <Modal visible={successVisible} animationType="slide">
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#3288FF" />
          <Text style={styles.successTitle}>인증 성공!</Text>
          <Text style={styles.successSub}>직원에게 이 화면을 보여주세요</Text>
          <View style={styles.couponCard}>
            <Text style={styles.couponStore}>{place.name}</Text>
            <Text style={styles.couponBenefit}>{place.benefit}</Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSuccessVisible(false)}
          >
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerImage: { width: "100%", height: 250 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 20,
    top: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 10,
  },
  name: { fontSize: 26, fontWeight: "bold", color: "#333", marginRight: 10 },
  badge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  desc: { fontSize: 16, color: "#666", marginBottom: 20 },
  benefitBox: {
    backgroundColor: "#E8F3FF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  benefitTitle: {
    fontSize: 14,
    color: "#3288FF",
    fontWeight: "bold",
    marginBottom: 5,
  },
  benefitText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  infoSection: { marginBottom: 25, gap: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoText: { fontSize: 16, color: "#333" },
  copyBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  copyText: { fontSize: 12, color: "#666" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  menuList: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10 },
  menuItem: { marginBottom: 8 },
  menuText: { fontSize: 16, color: "#555" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: 40,
  },
  actionButton: {
    backgroundColor: "#3288FF",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  actionButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  // 모달 스타일 (아까와 동일)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  closeIcon: { position: "absolute", top: 15, right: 15 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderBottomWidth: 2,
    borderColor: "#3288FF",
    fontSize: 24,
    textAlign: "center",
    padding: 10,
    marginBottom: 25,
  },
  confirmBtn: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#3288FF",
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontWeight: "bold" },
  // 성공 스타일
  successContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3288FF",
    marginTop: 20,
  },
  successSub: { fontSize: 16, color: "#888", marginBottom: 30 },
  couponCard: {
    width: "100%",
    padding: 30,
    backgroundColor: "#F5F7FB",
    borderRadius: 20,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 40,
  },
  couponStore: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  couponBenefit: { fontSize: 18, color: "#3288FF", fontWeight: "bold" },
  closeBtn: {
    width: "100%",
    padding: 18,
    backgroundColor: "#333",
    borderRadius: 15,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
