// 파일: app/(tabs)/my_team.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { myTeamState, updatePostStatus } from '../store';

export default function MyTeamTab() {
  const router = useRouter();
  const [myTeam, setMyTeam] = useState<any>(null);

  // 탭이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      // store에 있는 내 팀 정보 가져오기
      if (myTeamState.currentTeam) {
        setMyTeam({ ...myTeamState.currentTeam });
      } else {
        setMyTeam(null);
      }
    }, [])
  );

  // 친구 입장 시뮬레이션 (테스트용)
  const simulateJoin = () => {
    if (!myTeam) return;

    // 객체 복사 후 멤버 추가
    const newTeam = { ...myTeam };
    if (!newTeam.members) newTeam.members = []; // 안전장치
    
    newTeam.members.push({ name: '친구(입장함)', status: 'READY' });
    
    // Store와 State 모두 업데이트
    myTeamState.currentTeam = newTeam; 
    setMyTeam(newTeam);
  };

  const handleRegister = () => {
    // 🔴 에러 방지용 안전장치 추가
    if (!myTeam || !myTeam.id) {
      Alert.alert('오류', '팀 정보를 찾을 수 없습니다.');
      return;
    }

    // 글 상태 ACTIVE로 변경
    updatePostStatus(myTeam.id, 'ACTIVE');
    
    Alert.alert('등록 완료!', '이제 홈 화면에 우리 팀이 보입니다.');
    router.push('/(tabs)'); // 홈으로 이동
  };

  // 1. 팀이 없을 때 화면 (방 만들기 버튼)
  if (!myTeam) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={80} color="#ddd" />
        <Text style={styles.emptyTitle}>아직 만든 팀이 없어요</Text>
        <Text style={styles.emptyDesc}>친구들과 함께 과팅을 나가보세요!</Text>
        
        <TouchableOpacity style={styles.createButton} onPress={() => router.push('/write')}>
          <Text style={styles.createButtonText}>+ 과팅 방 만들기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. 팀이 있을 때 화면 (대기실 Lobby)
  const isFull = myTeam.members && myTeam.members.length >= 3;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 팀 관리</Text>
        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{myTeam.status === 'WAITING' ? '대기중' : '등록됨'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.teamTitle}>{myTeam.title || '제목 없음'}</Text>
        <Text style={styles.codeLabel}>초대 코드: <Text style={styles.code}>{myTeam.inviteCode || 'NEW-1234'}</Text></Text>
        
        <View style={styles.memberList}>
            {/* 3명 슬롯 그리기 */}
            {[0, 1, 2].map((i) => {
                const member = myTeam.members ? myTeam.members[i] : null;
                return (
                    <View key={i} style={styles.memberRow}>
                        <Ionicons 
                            name={member ? "person" : "add-circle-outline"} 
                            size={40} 
                            color={member ? "#3288FF" : "#ccc"} 
                        />
                        <Text style={styles.memberName}>{member ? member.name : "친구 대기중..."}</Text>
                    </View>
                )
            })}
        </View>
      </View>

      {/* 대기중일 때만 보이는 버튼들 */}
      {myTeam.status === 'WAITING' && (
        <>
            <TouchableOpacity style={styles.testBtn} onPress={simulateJoin}>
                <Text>🛠 (테스트) 친구 입장시키기</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.registBtn, !isFull && styles.disabledBtn]} 
                disabled={!isFull}
                onPress={handleRegister}
            >
                <Text style={styles.registBtnText}>{isFull ? "팀 등록하기 (공개)" : "3명이 모여야 등록 가능"}</Text>
            </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  emptyDesc: { color: '#888', marginBottom: 30 },
  createButton: { backgroundColor: '#3288FF', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30 },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  statusBadge: { backgroundColor: '#eee', padding: 5, borderRadius: 5 },
  statusText: { fontSize: 12, color: '#666' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20 },
  teamTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  codeLabel: { color: '#666', marginBottom: 20 },
  code: { color: '#3288FF', fontWeight: 'bold', fontSize: 18 },
  memberList: { gap: 15 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  memberName: { fontSize: 16 },
  testBtn: { padding: 10, backgroundColor: '#eee', alignItems: 'center', borderRadius: 8, marginBottom: 10 },
  registBtn: { backgroundColor: '#3288FF', padding: 15, borderRadius: 10, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#ccc' },
  registBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});