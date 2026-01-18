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
} from "react-native";

// ✅ 공통 컴포넌트 불러오기 (경로가 다르면 수정해주세요!)
import { InputBox } from "../../components/ui/InputBox";
import { MainButton } from "../../components/ui/MainButton";

export default function ProfileTab() {
  const router = useRouter();

  // 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("코딩하는 곰 🐻");
  const [major, setMajor] = useState("단국대학교 소프트웨어학과");
  const [profileImage, setProfileImage] = useState(
    "https://avatar.iran.liara.run/public/boy?username=Me"
  );

  // 수정 모드 토글
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 사진 변경 알림
  const handleImageChange = () => {
    Alert.alert("알림", "사진 변경 기능은 추후 구현 예정입니다!");
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

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          {/* 이미지 (수정 시 카메라 아이콘 표시) */}
          <TouchableOpacity
            style={styles.avatarContainer}
            disabled={!isEditing}
            onPress={handleImageChange}
          >
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            {isEditing && (
              <View style={styles.cameraIconBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* 📝 정보 영역: 수정 모드일 땐 InputBox, 아닐 땐 Text */}
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
              </>
            ) : (
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text style={styles.name}>{nickname}</Text>
                <Text style={styles.major}>{major}</Text>
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
});
