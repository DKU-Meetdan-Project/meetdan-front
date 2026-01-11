import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TempNotification() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림 센터</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>오늘</Text>

        {/* 알림 1: 매칭 신청 옴 */}
        <View style={styles.notiItem}>
          <View style={[styles.iconBox, { backgroundColor: "#E3F2FD" }]}>
            <Ionicons name="heart" size={24} color="#3288FF" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.notiText}>
              <Text style={styles.bold}>시각디자인과</Text> 팀이 매칭을
              신청했어요! 💌
            </Text>
            <Text style={styles.time}>방금 전</Text>
          </View>
        </View>

        {/* 알림 2: 매칭 성사 */}
        <View style={styles.notiItem}>
          <View style={[styles.iconBox, { backgroundColor: "#FFF3E0" }]}>
            <Ionicons name="chatbubbles" size={24} color="#FF9800" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.notiText}>
              <Text style={styles.bold}>체육교육과</Text> 팀과 매칭이
              성사되었습니다. 채팅을 시작해보세요!
            </Text>
            <Text style={styles.time}>1시간 전</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>이번 주</Text>

        {/* 알림 3: 공지사항 */}
        <View style={styles.notiItem}>
          <View style={[styles.iconBox, { backgroundColor: "#F5F5F5" }]}>
            <Ionicons name="megaphone" size={24} color="#666" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.notiText}>
              [공지] 미팅 매너를 지켜주세요 🚨
            </Text>
            <Text style={styles.time}>1일 전</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 40,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 15,
    marginTop: 10,
  },
  notiItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textBox: { flex: 1 },
  notiText: { fontSize: 15, color: "#333", lineHeight: 22 },
  bold: { fontWeight: "bold" },
  time: { fontSize: 12, color: "#aaa", marginTop: 4 },
});
