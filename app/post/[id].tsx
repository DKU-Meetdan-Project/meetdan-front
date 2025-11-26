// 파일 경로: app/post/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PostDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const postData = {
    id: '1',
    title: '소프트웨어학과 남자 3명! 술 진탕 마실 분 구함 🍻',
    content: '안녕하세요! 저희는 소프트웨어학과 20학번 동기들입니다.\n\n다들 성격 둥글둥글하고 술자리 분위기 잘 띄웁니다. 너무 시끄러운 건 싫고 적당히 대화하면서 마시고 싶어요.\n\n안주는 저희가 맛있는 곳 압니다. 몸만 오세요! 😎',
    dept: '소프트웨어학과',
    age: 23,
    count: 3,
    gender: 'M', 
    tags: ['#술잘마심', '#유머감각', '#칼답', '#키180이상'],
  };

  const isMale = postData.gender === 'M';
  const pointColor = isMale ? '#3288FF' : '#FF6B6B';

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>팀 상세정보</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 상단 요약 카드 */}
        <View style={styles.summaryCard}>
          <View style={styles.badgeRow}>
            <View style={styles.deptBadge}>
              <Text style={styles.deptText}>{postData.dept}</Text>
            </View>
            <Text style={styles.dateText}>방금 전</Text>
          </View>
          <Text style={styles.title}>{postData.title}</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>인원</Text>
              <Text style={[styles.infoValue, { color: pointColor }]}>{postData.count}명</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>평균 나이</Text>
              <Text style={[styles.infoValue, { color: pointColor }]}>{postData.age}세</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>성별</Text>
              <Text style={[styles.infoValue, { color: pointColor }]}>남성팀</Text>
            </View>
          </View>
        </View>

        {/* 멤버 구성 (블라인드 처리) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>멤버 구성 🕵️</Text>
          <View style={styles.memberRow}>
            {[...Array(postData.count)].map((_, i) => (
              <View key={i} style={styles.memberItem}>
                <View style={[styles.avatarCircle, { backgroundColor: isMale ? '#E8F3FF' : '#FFF0F0' }]}>
                  <Ionicons name="person" size={24} color={pointColor} />
                </View>
                <Text style={styles.memberName}>멤버 {i + 1}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 상세 소개글 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>어필 내용 📝</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{postData.content}</Text>
          </View>
        </View>

        {/* 태그 */}
        <View style={styles.tagRow}>
          {postData.tags.map((tag, i) => (
            <Text key={i} style={styles.tag}>{tag}</Text>
          ))}
        </View>

        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.matchButton, { backgroundColor: pointColor }]}
          onPress={() => router.push(`/match/party/${postData.id}`)}
        >
          <Text style={styles.matchButtonText}>파티 꾸려서 신청하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  deptBadge: { backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  deptText: { color: '#666', fontSize: 12, fontWeight: '600' },
  dateText: { color: '#aaa', fontSize: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, lineHeight: 28 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 15 },
  infoItem: { alignItems: 'center' },
  divider: { width: 1, height: '100%', backgroundColor: '#eee' },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: 'bold' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  memberRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', padding: 20, borderRadius: 16 },
  memberItem: { alignItems: 'center' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  memberName: { fontSize: 12, color: '#666' },
  contentBox: { backgroundColor: '#fff', padding: 20, borderRadius: 16, minHeight: 100 },
  contentText: { fontSize: 16, color: '#444', lineHeight: 24 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { color: '#888', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#eee', fontSize: 14 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#eee' },
  matchButton: { width: '100%', padding: 18, borderRadius: 12, alignItems: 'center' },
  matchButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});