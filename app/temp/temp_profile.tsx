import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

export default function TempProfile() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </View>

      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>
          이재우 <Text style={styles.studentId}>(32243399)</Text>
        </Text>
        <Text style={styles.dept}>소프트웨어학과 💻</Text>

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>#ENTP</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>#술잘마심</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>#개발자</Text>
          </View>
        </View>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuList}>
        <MenuRow icon="card" text="내 학과 인증하기" badge="완료" />
        <MenuRow icon="heart" text="내가 보낸 좋아요" />
        <MenuRow icon="document-text" text="이용 약관" />
        <MenuRow icon="log-out" text="로그아웃" color="red" />
      </View>
    </View>
  );
}

// 메뉴 한 줄 부품
const MenuRow = ({ icon, text, badge, color = "#333" }: any) => (
  <TouchableOpacity style={styles.menuRow}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={{ fontSize: 16, color: color }}>{text}</Text>
    </View>
    {badge && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
    {!badge && <Ionicons name="chevron-forward" size={20} color="#ddd" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  profileCard: {
    backgroundColor: "#fff",
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3288FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  studentId: { fontSize: 14, color: "#888", fontWeight: "normal" },
  dept: { fontSize: 16, color: "#666", marginBottom: 15 },
  tagRow: { flexDirection: "row", gap: 8 },
  tag: {
    backgroundColor: "#F0F4FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tagText: { color: "#3288FF", fontSize: 12, fontWeight: "bold" },
  menuList: { backgroundColor: "#fff", paddingHorizontal: 20 },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  badge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#3288FF", fontSize: 11, fontWeight: "bold" },
});
