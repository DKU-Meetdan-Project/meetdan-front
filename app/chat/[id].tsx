import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

// ✅ 메시지 타입 정의 (일반 텍스트 vs 시스템 vs 제안)
type Message = {
  id: string;
  text: string;
  sender: "me" | "them" | "system";
  time: string;
  type?: "text" | "proposal"; // proposal: 종료 제안 메시지
};

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    text: "매칭이 성사되었습니다! 🎉\n이제 대화를 시작해보세요.",
    sender: "system",
    time: "12:00",
    type: "text",
  },
  {
    id: "2",
    text: "안녕하세요! 소프트웨어학과 분들 맞으시죠?",
    sender: "them",
    time: "12:01",
    type: "text",
  },
  {
    id: "3",
    text: "네 안녕하세요! 반갑습니다 ㅋㅋ",
    sender: "me",
    time: "12:02",
    type: "text",
  },
];

const MOCK_PARTICIPANTS = [
  { id: "p1", name: "손흥민", dept: "소프트", role: "me" },
  { id: "p2", name: "호날두", dept: "소프트", role: "me" },
  { id: "p3", name: "김세홍", dept: "소프트", role: "them" },
  { id: "p4", name: "박상현", dept: "디자인", role: "them" },
  { id: "p5", name: "효르", dept: "디자인", role: "them" },
  { id: "p6", name: "닥터후", dept: "디자인", role: "them" },
];

export default function ChatRoom() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // ✅ [종료 제안] 보내기 함수
  const sendExitProposal = () => {
    setIsMenuOpen(false); // 서랍 닫기
    const newMessage: Message = {
      id: Date.now().toString(),
      text: "우리 이제 그만 대화할까요? 🥲\n(상대방이 동의하면 채팅방이 종료됩니다)",
      sender: "system", // 시스템 메시지로 처리
      time: "",
      type: "proposal", // ✨ 중요: 메시지 타입을 'proposal'로 설정
    };
    setMessages([...messages, newMessage]);
  };

  // ✅ [종료 제안] 처리 함수 (수락/거절)
  const handleProposalDecision = (decision: "ACCEPT" | "REJECT") => {
    if (decision === "ACCEPT") {
      Alert.alert(
        "채팅 종료",
        "양쪽 팀장의 동의로 채팅방이 폭파되었습니다. 💣",
        [{ text: "확인", onPress: () => router.replace("/(tabs)") }]
      );
    } else {
      Alert.alert(
        "거절됨",
        "상대방이 채팅 종료를 거절했습니다. 대화를 계속해보세요!"
      );
      // 실제로는 여기서 "거절 메시지"를 시스템 메시지로 추가해주면 좋습니다.
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  // 렌더링
  const renderItem = ({ item }: { item: Message }) => {
    // 1. 시스템 메시지 (입장/퇴장 등)
    if (item.sender === "system" && item.type !== "proposal") {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    // 2. ✨ [신규 기능] 종료 제안 메시지 (투표창)
    if (item.type === "proposal") {
      return (
        <View style={styles.proposalContainer}>
          <View style={styles.proposalCard}>
            <Ionicons
              name="alert-circle"
              size={32}
              color="#FF6B6B"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.proposalTitle}>채팅 종료 제안</Text>
            <Text style={styles.proposalText}>
              상대 팀장이 대화 종료를 제안했습니다.{"\n"}동의하시겠습니까?
            </Text>
            <View style={styles.proposalButtons}>
              <TouchableOpacity
                style={[styles.proposalBtn, styles.rejectBtn]}
                onPress={() => handleProposalDecision("REJECT")}
              >
                <Text style={styles.rejectText}>거절</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.proposalBtn, styles.acceptBtn]}
                onPress={() => handleProposalDecision("ACCEPT")}
              >
                <Text style={styles.acceptText}>동의 (방 나가기)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    // 3. 일반 메시지
    const isMe = item.sender === "me";
    return (
      <View style={[styles.messageRow, isMe ? styles.myRow : styles.otherRow]}>
        {!isMe && <View style={styles.avatar} />}
        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myText : styles.otherText,
            ]}
          >
            {item.text}
          </Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ... 헤더 및 기타 UI는 기존과 동일 ... */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>디자인과 🌸 (3:3)</Text>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => setIsMenuOpen(true)}
        >
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
          style={styles.chatList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요..."
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 사이드 메뉴 (Drawer) */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>
          <View style={styles.drawerContent}>
            {/* ... 기존 서랍 내용 ... */}
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>채팅방 서랍</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* ✅ [나가기] 버튼 수정: 누르면 '제안' 함수 실행 */}
            <View style={styles.drawerFooter}>
              <TouchableOpacity
                style={styles.exitButton}
                onPress={() => {
                  Alert.alert(
                    "채팅 종료 제안",
                    "정말 종료를 제안하시겠습니까?\n상대방이 동의하면 방이 사라집니다.",
                    [
                      { text: "취소", style: "cancel" },
                      {
                        text: "제안하기",
                        style: "destructive",
                        onPress: sendExitProposal,
                      },
                    ]
                  );
                }}
              >
                <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
                <Text style={[styles.exitButtonText, { color: "#FF6B6B" }]}>
                  채팅방 종료 제안
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... 기존 스타일 유지 ...
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#b2c7da" },
  header: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  chatList: { flex: 1 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#3288FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // 메시지 스타일
  systemMessageContainer: { alignItems: "center", marginVertical: 15 },
  systemMessageText: {
    backgroundColor: "rgba(0,0,0,0.1)",
    color: "#555",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  myRow: { justifyContent: "flex-end" },
  otherRow: { justifyContent: "flex-start" },
  bubble: { maxWidth: "70%", padding: 12, borderRadius: 16 },
  myBubble: { backgroundColor: "#Fef01b", borderTopRightRadius: 0 },
  otherBubble: { backgroundColor: "#fff", borderTopLeftRadius: 0 },
  messageText: { fontSize: 15, lineHeight: 20 },
  myText: { color: "#333" },
  otherText: { color: "#333" },
  timeText: {
    fontSize: 10,
    color: "#555",
    marginHorizontal: 5,
    marginBottom: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    marginRight: 8,
  },

  // Drawer 스타일
  modalOverlay: { flex: 1, flexDirection: "row" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  drawerContent: {
    width: "75%",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  drawerTitle: { fontSize: 18, fontWeight: "bold" },
  drawerFooter: { position: "absolute", bottom: 40, left: 20, right: 20 },
  exitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    padding: 15,
    borderRadius: 12,
    justifyContent: "center",
  },
  exitButtonText: { marginLeft: 8, fontWeight: "bold" },

  // ✨ [신규] 종료 제안 카드 스타일
  proposalContainer: { alignItems: "center", marginVertical: 20 },
  proposalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  proposalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  proposalText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  proposalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  proposalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  rejectBtn: { backgroundColor: "#f0f0f0" },
  acceptBtn: { backgroundColor: "#FF6B6B" },
  rejectText: { color: "#666", fontWeight: "bold" },
  acceptText: { color: "#fff", fontWeight: "bold" },
});
