// 파일 경로: app/login.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  
  // 사용자의 입력을 저장하는 변수들 (State)
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 버튼 눌렀을 때 실행되는 함수
  const handleLogin = () => {
    // 나중에 여기에 백엔드 API 연동 코드가 들어갑니다!
    // 지금은 테스트용으로 콘솔에만 찍어봅시다.
    console.log('입력한 ID:', id);
    console.log('입력한 PW:', password);
    console.log("로그인 성공!");

    if (id === '' || password === '') {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // 임시로 바로 메인화면으로 이동시킴
    router.replace('/(tabs)'); // 뒤로가기 방지 위해 replace 사용
  };

  return (
    <View style={styles.container}>
      <View style={styles.formArea}>
        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>단국대 포털 계정으로 로그인하세요</Text>

        {/* 아이디 입력창 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>아이디 (학번)</Text>
          <TextInput 
            style={styles.input}
            placeholder="32XXXXXX"
            value={id}
            onChangeText={setId} // 입력할 때마다 id 변수 업데이트
            keyboardType="number-pad" // 숫자 키패드 띄우기
          />
        </View>

        {/* 비밀번호 입력창 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput 
            style={styles.input}
            placeholder="비밀번호 입력"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} // 비밀번호 가리기 (****)
          />
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        {/* 뒤로가기 (임시) */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#999' }}>이전 화면으로</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 30, // 양옆 여백
  },
  formArea: {
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#3288FF', // 단국대 블루
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});