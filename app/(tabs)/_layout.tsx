// 파일: app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#3288FF', // 선택됐을 때 색상
      headerShown: false // 상단 헤더 숨김 (각 화면에서 커스텀 할 거니까)
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarLabel: '매칭 찾기',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '신청 내역',
          tabBarLabel: '신청 내역',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my_team"
        options={{
          title: '내 팀',
          tabBarLabel: '방 만들기', // 여기가 핵심!
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내 정보',
          tabBarLabel: '계정 관리',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}