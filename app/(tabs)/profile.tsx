// 파일 경로: app/(tabs)/profile.tsx
import React, { useState } from "react"; // useState 추가
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileTab() {
  const router = useRouter();

  // 1. 상태 관리 (수정 모드, 내 정보 데이터)
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("코딩하는 곰 🐻");
  const [major, setMajor] = useState("단국대학교 소프트웨어학과");
  const [profileImage, setProfileImage] = useState(
    "https://avatar.iran.liara.run/public/boy?username=Me"
  );

  // 2. 버튼 핸들러
  const handleEditToggle = () => {
    setIsEditing(!isEditing); // 수정 모드 ON/OFF 토글
  };

  const handleImageChange = () => {
    // 나중에 expo-image-picker 연결할 곳
    Alert.alert("알림", "사진 변경 기능은 추후 앨범 권한이 필요합니다!");
  };

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

      {/* 프로필 섹션 (수정 기능 적용됨) */}
      <View style={styles.profileSection}>
        {/* 1. 이미지 영역 (수정 모드일 때 터치 가능) */}
        <TouchableOpacity
          style={styles.avatarContainer}
          disabled={!isEditing}
          onPress={handleImageChange}
        >
          <Image source={{ uri: profileImage }} style={styles.avatar} />
          {/* 수정 모드일 때만 카메라 아이콘 띄우기 */}
          {isEditing && (
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* 2. 닉네임 & 학과 (수정 모드에 따라 입력창/텍스트 변환) */}
        {isEditing ? (
          <View style={styles.editInputContainer}>
            <TextInput
              style={styles.inputName}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임 입력"
            />
            <TextInput
              style={styles.inputMajor}
              value={major}
              onChangeText={setMajor}
              placeholder="학과 입력"
            />
          </View>
        ) : (
          <>
            <Text style={styles.name}>{nickname}</Text>
            <Text style={styles.major}>{major}</Text>
          </>
        )}

        {/* 3. 수정/저장 버튼 */}
        <TouchableOpacity
          style={[styles.editButton, isEditing && styles.saveButton]}
          onPress={handleEditToggle}
        >
          <Text
            style={[styles.editButtonText, isEditing && styles.saveButtonText]}
          >
            {isEditing ? "저장 완료" : "프로필 수정"}
          </Text>
        </TouchableOpacity>
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

      {/* 로그아웃 버튼 (기존 유지) */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
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

  // 프로필 섹션 스타일 수정
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 10,
    borderBottomColor: "#F5F7FB",
  },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#eee" },

  // 카메라 아이콘 (수정 모드용)
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
  major: { fontSize: 14, color: "#888", marginBottom: 10 },

  // 입력창 스타일 (수정 모드용)
  editInputContainer: { width: "80%", alignItems: "center", marginBottom: 10 },
  inputName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
    padding: 5,
    marginBottom: 5,
    width: "100%",
  },
  inputMajor: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 5,
    width: "100%",
  },

  // 수정 버튼 스타일
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginTop: 5,
  },
  editButtonText: { fontSize: 13, color: "#666", fontWeight: "600" },
  saveButton: { backgroundColor: "#007AFF" }, // 저장 모드일 때 파란색
  saveButtonText: { color: "#fff" },

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
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: { color: "#FF6B6B", fontWeight: "bold" },
});
