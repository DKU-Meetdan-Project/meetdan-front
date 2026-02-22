import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 💡 방금 만드신 profile_avatars 폴더 경로로 맞췄습니다!
const profileImages = [
  require("../../assets/images/profile_avatars/1.png"),
  require("../../assets/images/profile_avatars/2.png"),
  require("../../assets/images/profile_avatars/3.png"),
  require("../../assets/images/profile_avatars/4.png"),
  require("../../assets/images/profile_avatars/5.png"),
  require("../../assets/images/profile_avatars/6.png"),
  require("../../assets/images/profile_avatars/7.png"),
  require("../../assets/images/profile_avatars/8.png"),
  require("../../assets/images/profile_avatars/9.png"),
  require("../../assets/images/profile_avatars/10.png"),
  require("../../assets/images/profile_avatars/11.png"),
  require("../../assets/images/profile_avatars/12.png"),
];

export default function ProfileTab() {
  const router = useRouter();

  const [campus, setCampus] = useState("죽전");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: () => {
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 프로필 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Image
            source={profileImages[selectedImageIdx]}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
        </View>
        <Text style={styles.name}>코딩하는 곰 🐻</Text>
        <Text style={styles.major}>단국대학교 소프트웨어학과</Text>

        {/* 캠퍼스 선택 버튼 */}
        <View style={styles.campusContainer}>
          <TouchableOpacity
            style={[
              styles.campusButton,
              campus === "죽전" && styles.campusActive,
            ]}
            onPress={() => setCampus("죽전")}
          >
            <Text
              style={[
                styles.campusText,
                campus === "죽전" && styles.campusActiveText,
              ]}
            >
              죽전 캠퍼스
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.campusButton,
              campus === "천안" && styles.campusActive,
            ]}
            onPress={() => setCampus("천안")}
          >
            <Text
              style={[
                styles.campusText,
                campus === "천안" && styles.campusActiveText,
              ]}
            >
              천안 캠퍼스
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 12개 캐릭터 선택 스크롤 영역 */}
      <View style={styles.imageSelectionSection}>
        <Text style={styles.sectionTitle}>프로필 캐릭터 선택</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {profileImages.map((img, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImageIdx(index)}
              style={[
                styles.imageWrapper,
                selectedImageIdx === index && styles.selectedImageWrapper,
              ]}
            >
              <Image source={img} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.menuText}>알림 설정</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#333" />
          <Text style={styles.menuText}>학생증 재인증</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color="#333" />
          <Text style={styles.menuText}>이용약관</Text>
        </TouchableOpacity>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  profileSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 10,
    borderBottomColor: "#F5F7FB",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    marginBottom: 15,
    overflow: "hidden",
  },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  major: { fontSize: 14, color: "#888", marginBottom: 20 },

  campusContainer: { flexDirection: "row", gap: 10 },
  campusButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  campusActive: { backgroundColor: "#0055A4", borderColor: "#0055A4" },
  campusText: { color: "#666", fontSize: 14 },
  campusActiveText: { color: "#fff", fontWeight: "bold" },

  imageSelectionSection: {
    padding: 20,
    borderBottomWidth: 10,
    borderBottomColor: "#F5F7FB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  imageScroll: { flexDirection: "row" },
  imageWrapper: {
    marginRight: 15,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedImageWrapper: { borderColor: "#0055A4" },
  thumbnail: { width: 60, height: 60, borderRadius: 30 },

  menuContainer: { padding: 20 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuText: { fontSize: 16, marginLeft: 15, color: "#333" },
  logoutButton: {
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: { color: "#FF6B6B", fontWeight: "bold" },
});
