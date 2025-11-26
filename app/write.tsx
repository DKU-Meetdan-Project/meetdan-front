// 파일 경로: app/write.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { setMyTeam } from './store'; // ✅ store에서 가져오기

export default function Write() {
  const router = useRouter();

  // 입력 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [age, setAge] = useState('');
  const [count, setCount] = useState(3); // 기본 3명

  const handleSubmit = () => {
    if (!title || !content || !age) {
      Alert.alert('잠깐!', '내용을 모두 채워주세요.');
      return;
    }

    // 1. 새로운 팀 객체 생성 (상태는 WAITING)
    const newTeam = {
      id: Date.now().toString(), // 유니크 ID
      title,
      content,
      age: parseInt(age),
      count,
      dept: '소프트웨어학과', // 로그인 정보 가정
      gender: 'M',
      tags: ['#신규', '#따끈따끈'],
      timestamp: '방금 전',
      status: 'WAITING', // 👈 아직 홈에는 안 뜸! 대기 상태
    };

    // 2. 내 팀으로 설정 (store에 저장)
    setMyTeam(newTeam);

    Alert.alert('팀 생성 완료', '친구를 초대하러 이동합니다!');
    
    // 3. ✅ 홈이 아니라, 방금 만든 '내 팀(방 만들기)' 탭으로 이동
    router.replace('/(tabs)/my_team'); 
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>팀 만들기</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.submitText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        {/* 인원수 선택 */}
        <Text style={styles.label}>몇 명이서 나가나요?</Text>
        <View style={styles.countContainer}>
          {[2, 3, 4].map((num) => (
            <TouchableOpacity 
              key={num} 
              style={[styles.countButton, count === num && styles.countButtonActive]}
              onPress={() => setCount(num)}
            >
              <Text style={[styles.countText, count === num && styles.countTextActive]}>
                {num}:{num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 평균 나이 */}
        <Text style={styles.label}>팀원 평균 나이는?</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 23"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          maxLength={2}
        />

        {/* 제목 */}
        <Text style={styles.label}>제목 (임팩트 있게!)</Text>
        <TextInput
          style={styles.input}
          placeholder="소프트웨어학과 3명 술 진탕 마셔요"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        {/* 어필 내용 */}
        <Text style={styles.label}>우리 팀 매력 어필</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="MBTI, 주량, 분위기 등 자유롭게 적어주세요."
          placeholderTextColor="#999"
          multiline={true}
          value={content}
          onChangeText={setContent}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3288FF',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top', 
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    borderBottomWidth: 1, 
  },
  countContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  countButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  countButtonActive: {
    backgroundColor: '#E8F3FF',
    borderColor: '#3288FF',
  },
  countText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  countTextActive: {
    color: '#3288FF',
  },
});