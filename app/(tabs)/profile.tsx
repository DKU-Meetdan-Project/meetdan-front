// 파일 경로: app/(tabs)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileTab() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '로그아웃', 
        style: 'destructive',
        onPress: () => {
          // 로그아웃 처리 후 로그인 화면으로 이동
          // replace를 써서 뒤로가기 방지
          router.replace('/login');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 프로필 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
           <Image 
             source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Me' }} 
             style={{ width: 80, height: 80, borderRadius: 40 }}
           />
        </View>
        <Text style={styles.name}>코딩하는 곰 🐻</Text>
        <Text style={styles.major}>단국대학교 소프트웨어학과</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  profileSection: { alignItems: 'center', paddingVertical: 40, borderBottomWidth: 10, borderBottomColor: '#F5F7FB' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee', marginBottom: 15, overflow: 'hidden' },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  major: { fontSize: 14, color: '#888' },
  menuContainer: { padding: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuText: { fontSize: 16, marginLeft: 15, color: '#333' },
  logoutButton: { marginTop: 20, marginHorizontal: 20, backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#FF6B6B', fontWeight: 'bold' },
});