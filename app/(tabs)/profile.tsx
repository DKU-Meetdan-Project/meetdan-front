// 파일 경로: app/(tabs)/profile.tsx
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal, // 모달 추가
} from "react-native";

// ✅ 공통 컴포넌트 불러오기 (기존 유지)
import { InputBox } from "../../components/InputBox";
import { MainButton } from "../../components/MainButton";

// 💡 12개 프로필 이미지 에셋 불러오기
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

  // 기본 정보 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("코딩하는 곰 🐻");
  const [major, setMajor] = useState("단국대학교 소프트웨어학과");
  const [campus, setCampus] = useState("죽전"); // 캠퍼스 상태 추가

  // 아바타 관련 상태 관리
  const [selectedImageIdx, setSelectedImageIdx] = useState(0); // 현재 내 프로필
  const [isModalVisible, setModalVisible] = useState(false); // 팝업창 상태
  const [tempSelectedIdx, setTempSelectedIdx] = useState(0); // 팝업창에서 임시로 고른 아바타

  // 수정 모드 토글
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 아바타 팝업창 열기 (기존 handleImageChange 대체)
  const openAvatarModal = () => {
    setTempSelectedIdx(selectedImageIdx); // 열 때 현재 내 프사로 세팅
    setModalVisible(true);
  };

  // 팝업창에서 확인 버튼 누름
  const confirmAvatar = () => {
    setSelectedImageIdx(tempSelectedIdx); // 프사 확정!
    setModalVisible(false);
  };

  // 로그아웃 핸들러
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
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          {/* 이미지 (수정 모드일 때만 클릭 가능 & 카메라 아이콘 표시) */}
          <TouchableOpacity
            style={styles.avatarContainer}
            disabled={!isEditing} // 💡 수정 모드가 아닐 땐 터치 안 됨
            onPress={openAvatarModal}
          >
            <Image
              source={profileImages[selectedImageIdx]}
              style={styles.avatar}
            />
            {isEditing && (
              <View style={styles.cameraIconBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* 📝 정보 영역: 수정 모드일 땐 InputBox + 캠퍼스 버튼, 아닐 땐 Text */}
          <View style={{ width: "100%", paddingHorizontal: 20 }}>
            {isEditing ? (
              <>
                <InputBox
                  label="닉네임"
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="닉네임을 입력하세요"
                />
                <InputBox
                  label="학과"
                  value={major}
                  onChangeText={setMajor}
                  placeholder="학과를 입력하세요"
                />

                {/* 캠퍼스 선택 영역 (수정 모드에서만 보임) */}
                <Text style={styles.campusLabel}>캠퍼스</Text>
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
                      죽전
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
                      천안
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text style={styles.name}>{nickname}</Text>
                {/* 일반 모드일 땐 캠퍼스와 학과를 묶어서 텍스트로 보여줌 */}
                <Text style={styles.major}>
                  {campus} 캠퍼스 | {major}
                </Text>
              </View>
            )}

            {/* ✅ 공통 버튼 사용 */}
            <MainButton
              title={isEditing ? "저장 완료" : "프로필 수정"}
              onPress={handleEditToggle}
            />
          </View>
        </View>

        {/* 메뉴 리스트 (기존 유지) */}
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

      {/* ========================================================= */}
      {/* 팝업창 (Modal) 영역: 프사 눌렀을 때만 뿅 나타남 */}
      {/* ========================================================= */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>프로필 캐릭터 선택</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              {profileImages.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setTempSelectedIdx(index)} // 임시 선택
                  style={[
                    styles.imageWrapper,
                    tempSelectedIdx === index && styles.selectedImageWrapper,
                  ]}
                >
                  <Image source={img} style={styles.thumbnail} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmAvatar}
              >
                <Text style={styles.confirmBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingVertical: 30,
    borderBottomWidth: 10,
    borderBottomColor: "#F5F7FB",
  },
  avatarContainer: { position: "relative", marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#eee" },
  cameraIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },

  name: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  major: { fontSize: 14, color: "#888" },

  // 캠퍼스 선택 스타일 추가
  campusLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
  },
  campusContainer: { flexDirection: "row", gap: 10, marginBottom: 25 },
  campusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  campusActive: { backgroundColor: "#333", borderColor: "#333" },
  campusText: { color: "#666", fontSize: 14, fontWeight: "500" },
  campusActiveText: { color: "#fff", fontWeight: "bold" },

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
    marginBottom: 30,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: { color: "#FF6B6B", fontWeight: "bold" },

  // 모달 전용 스타일 추가
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },

  imageScroll: { flexDirection: "row", marginBottom: 25 },
  imageWrapper: {
    marginRight: 15,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedImageWrapper: { borderColor: "#333" },
  thumbnail: { width: 70, height: 70, borderRadius: 35 },

  modalBtnRow: { flexDirection: "row", gap: 10, width: "100%" },
  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  cancelBtnText: { color: "#666", fontSize: 16, fontWeight: "bold" },
  confirmBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
