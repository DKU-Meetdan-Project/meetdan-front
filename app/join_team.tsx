// 파일 경로: app/join_team.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function JoinTeam() {
  const router = useRouter();
  const [code, setCode] = useState('');

  // ✅ 에러 해결: code 파라미터가 없어도 state를 쓰면 되므로 파라미터를 제거했습니다.
  const handleJoin = () => {
    if (code.length < 2) {
      Alert.alert('알림', '올바른 코드를 입력해주세요.');
      return;
    }

    // 🕵️‍♂️ 백엔드 로직 시뮬레이션
    // 실제로는 서버에 이 코드를 보내면 서버가 "이건 3번 팀의 대기방이야"라고 알려줍니다.
    
    // 시나리오 1: "NEW"로 시작하면 [팀 만들기 대기방]으로 이동
    if (code.toUpperCase().startsWith('NEW')) {
      Alert.alert('팀 합류', '팀 만들기 대기실로 입장합니다!');
      router.replace('/team/lobby/1'); 
    } 
    // 시나리오 2: "FIGHT"로 시작하면 [매칭 공격대 대기방]으로 이동
    else if (code.toUpperCase().startsWith('FIGHT')) {
      Alert.alert('파티 합류', '매칭 공격대 파티로 입장합니다!');
      router.replace('/match/party/2'); 
    } 
    // 그 외: 없는 코드 처리
    else {
      Alert.alert('오류', '유효하지 않은 초대 코드입니다.\n(힌트: NEW 또는 FIGHT로 시작해보세요)');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>초대 코드 입력 🎫</Text>
            <Text style={styles.subtitle}>친구에게 받은 코드를 입력하고{'\n'}팀에 합류하세요!</Text>
          </View>

          {/* 코드 입력창 */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="예: NEW-TEAM-01"
              placeholderTextColor="#ccc"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters" // 자동으로 대문자로 변환
              autoCorrect={false}
            />
          </View>

          {/* 입장 버튼 */}
          <TouchableOpacity 
            style={[styles.joinButton, code.length > 0 && styles.joinButtonActive]} 
            onPress={handleJoin}
            disabled={code.length === 0}
          >
            <Text style={styles.joinButtonText}>입장하기</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingBottom: 100, // 키보드 올라올 때 여유 공간
  },
  textContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputWrapper: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F5F7FB',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    letterSpacing: 1,
  },
  joinButton: {
    backgroundColor: '#ddd',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  joinButtonActive: {
    backgroundColor: '#3288FF',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});