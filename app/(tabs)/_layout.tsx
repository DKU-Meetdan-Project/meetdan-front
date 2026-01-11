// 파일: app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3288FF",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarStyle: {
          // ✅ 수정된 부분: 높이를 키워서 잘림 방지
          height: Platform.OS === "ios" ? 95 : 75, // (기존 85/65 -> 95/75로 증가)
          paddingBottom: Platform.OS === "ios" ? 35 : 15, // 하단 여백 확보
          paddingTop: 10,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12, // 글자 크기도 살짝 키움 (11 -> 12)
          fontWeight: "bold",
          marginBottom: 5, // 아이콘과 글자 사이 간격 추가
        },
      }}
    >
      {/* 1. 홈 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarLabel: "홈",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 2. 내 팀 */}
      <Tabs.Screen
        name="my_team"
        options={{
          title: "내 팀",
          tabBarLabel: "내 팀 관리",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />

      {/* 3. 🎁 혜택받기 (중앙 플로팅 버튼) */}
      <Tabs.Screen
        name="places"
        options={{
          title: "제휴 핫플",
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: -25, // 탭바가 높아졌으니 버튼도 조금 더 위로 올림 (-20 -> -25)
                width: 65, // 버튼 크기도 살짝 키움 (60 -> 65)
                height: 65,
                borderRadius: 32.5,
                backgroundColor: "#3288FF",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#3288FF",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
                borderWidth: 4,
                borderColor: "#f5f7fb",
              }}
            >
              <Ionicons
                name="gift"
                size={32} // 아이콘도 키움 (28 -> 32)
                color="#fff"
              />
            </View>
          ),
        }}
      />

      {/* 4. 내역 */}
      <Tabs.Screen
        name="history"
        options={{
          title: "신청 내역",
          tabBarLabel: "내역",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 5. 프로필 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "내 정보",
          tabBarLabel: "MY",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
