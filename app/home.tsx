// 파일 경로: app/home.tsx
import { Ionicons } from '@expo/vector-icons'; // 아이콘 사용
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 1. 데이터 구조 변경 (TeamPost 스키마)
const MOCK_POSTS = [
  {
    id: '1',
    title: '소프트웨어학과 남자 3명! 술 진탕 마실 분 구함 🍻',
    dept: '소프트웨어학과',
    gender: 'M', // M: 남자팀, F: 여자팀
    count: 3,
    avgAge: 23,
    tags: ['#술잘마심', '#재밌음', '#칼답'],
    timestamp: '방금 전',
  },
  {
    id: '2',
    title: '디자인과 22학번 3명 미팅해요~ 🌸',
    dept: '시각디자인과',
    gender: 'F',
    count: 3,
    avgAge: 22,
    tags: ['#분위기파', '#맛집투어', '#비흡연'],
    timestamp: '10분 전',
  },
  {
    id: '3',
    title: '체육교육과 듬직한 형님들 3명 대기중',
    dept: '체육교육과',
    gender: 'M',
    count: 3,
    avgAge: 24,
    tags: ['#운동남', '#매너좋음', '#키큼'],
    timestamp: '1시간 전',
  },
  {
    id: '4',
    title: '시험 끝난 경영학과랑 노실 분??',
    dept: '경영학과',
    gender: 'F',
    count: 3,
    avgAge: 21,
    tags: ['#E성향', '#노래방', '#텐션높음'],
    timestamp: '3시간 전',
  },
];

export default function Home() {
  const router = useRouter();

  // 2. 게시글 카드 렌더링
  const renderItem = ({ item }: { item: any }) => {
    // 성별에 따른 색상 설정
    const isMale = item.gender === 'M';
    const pointColor = isMale ? '#3288FF' : '#FF6B6B'; // 파랑 vs 분홍
    const iconName = isMale ? 'male' : 'female';

    return (
        <TouchableOpacity 
  style={styles.card} 
  onPress={() => router.push(`/post/${item.id}`)}
>
        {/* 상단: 학과 및 작성 시간 */}
        <View style={styles.cardHeader}>
          <View style={styles.deptBadge}>
            <Text style={styles.deptText}>{item.dept}</Text>
          </View>
          <Text style={styles.timeText}>{item.timestamp}</Text>
        </View>

        {/* 중단: 제목 */}
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

        {/* 하단: 정보 요약 (인원, 나이) */}
        <View style={styles.infoRow}>
          <View style={[styles.infoBadge, { backgroundColor: isMale ? '#E8F3FF' : '#FFF0F0' }]}>
            <Ionicons name={iconName} size={14} color={pointColor} style={{ marginRight: 4 }} />
            <Text style={[styles.infoText, { color: pointColor }]}>
              {item.count}명 · 평균 {item.avgAge}세
            </Text>
          </View>
        </View>

        {/* 태그 영역 */}
        <View style={styles.tagRow}>
          {item.tags.map((tag: string, index: number) => (
            <Text key={index} style={styles.tagText}>{tag}</Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MeetDan 🔥</Text>
        {/* router.push로 이동 */}
<TouchableOpacity style={styles.writeButton} onPress={() => router.push('/write')}>
          <Text style={styles.writeButtonText}>+ 글쓰기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.filterRow}>
            <Text style={styles.filterTitle}>최신 과팅 모집</Text>
            {/* 필터 버튼 같은 게 들어갈 자리 */}
        </View>
        
        <FlatList
          data={MOCK_POSTS}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  writeButton: {
    backgroundColor: '#3288FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  writeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filterRow: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  // 게시글 카드 스타일
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deptBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deptText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#aaa',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  infoText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#888',
  },
});