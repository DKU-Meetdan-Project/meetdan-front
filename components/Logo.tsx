// 파일: components/Logo.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  G,
  Circle,
  Path,
} from "react-native-svg";

interface MeetDanLogoProps {
  size?: number; // 로고 크기 (기본 120)
  showText?: boolean; // 글자 보여줄지 여부 (기본 true)
}

export default function MeetDanLogo({
  size = 120,
  showText = true,
}: MeetDanLogoProps) {
  return (
    <View style={styles.container}>
      {/* 1. 로고 아이콘 (SVG) */}
      <View style={{ width: size, height: size }}>
        <Svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
          <Defs>
            <LinearGradient
              id="blueGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#5BA3FF" />
              <Stop offset="100%" stopColor="#0066FF" />
            </LinearGradient>
          </Defs>

          {/* 배경 둥근 사각형 */}
          <Rect
            x="15"
            y="15"
            width="90"
            height="90"
            rx="24"
            fill="url(#blueGradient)"
          />

          {/* 아이콘 그룹 (중앙 정렬) */}
          <G x="60" y="60">
            {/* 왼쪽 사람 */}
            <Circle cx="-12" cy="-8" r="6" fill="white" />
            <Rect x="-18" y="0" width="12" height="16" rx="6" fill="white" />

            {/* 오른쪽 사람 */}
            <Circle cx="12" cy="-8" r="6" fill="white" />
            <Rect x="6" y="0" width="12" height="16" rx="6" fill="white" />

            {/* 중앙 하트 (크기 조절됨) */}
            <Path
              d="M 0,2 C -1,0 -2.5,0 -2.5,2 C -2.5,3.5 0,6 0,6 C 0,6 2.5,3.5 2.5,2 C 2.5,0 1,0 0,2 Z"
              fill="#FF6B9D"
              transform="scale(1.8)"
            />
          </G>
        </Svg>
      </View>

      {/* 2. 앱 이름 텍스트 */}
      {showText && (
        <View style={styles.textContainer}>
          {/* 앱에서는 텍스트 그라데이션이 복잡해서 깔끔한 브랜드 컬러로 대체했습니다 */}
          <Text style={[styles.title, { fontSize: size * 0.25 }]}>MeetDan</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12, // 아이콘과 글자 사이 간격
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#3288FF", // 브랜드 컬러 (파란색)
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: "600",
    color: "#888", // 회색
  },
});
