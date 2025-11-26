// 파일: app/(tabs)/history.tsx
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 더미 데이터
const REQUESTS = [
  { id: '1', type: 'SENT', to: '디자인과 🌸', status: 'PENDING', date: '방금 전' },
  { id: '2', type: 'RECEIVED', from: '체육교육과 형님들', status: 'ACCEPTED', date: '어제' },
  { id: '3', type: 'SENT', to: '경영학과', status: 'REJECTED', date: '2일 전' },
];

export default function HistoryTab() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => {
    const isSent = item.type === 'SENT';
    return (
      <TouchableOpacity 
        style={styles.card}
        // 수락됨(ACCEPTED) 상태면 채팅방으로 이동
        onPress={() => item.status === 'ACCEPTED' ? router.push('/chat/1') : null}
      >
        <View style={styles.row}>
            <View>
                <Text style={styles.badge}>{isSent ? '보낸 신청 📤' : '받은 신청 📥'}</Text>
                <Text style={styles.title}>{isSent ? `To. ${item.to}` : `From. ${item.from}`}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={[styles.statusBox, 
                item.status === 'ACCEPTED' ? styles.statusBlue : 
                item.status === 'REJECTED' ? styles.statusRed : styles.statusGray]}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>신청 내역</Text>
      <FlatList 
        data={REQUESTS}
        renderItem={renderItem}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', marginLeft: 20, marginBottom: 10 },
  card: { backgroundColor: '#F5F7FB', padding: 20, borderRadius: 12, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { fontSize: 12, color: '#666', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  date: { fontSize: 12, color: '#aaa' },
  statusBox: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusBlue: { backgroundColor: '#E8F3FF' },
  statusRed: { backgroundColor: '#FFF0F0' },
  statusGray: { backgroundColor: '#eee' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#555' }
});