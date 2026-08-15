import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, Hairline, Palette, Spacing, Typo } from "@/constants/theme";

/**
 * 화면 컨테이너. 상단 노치 여백을 직접 계산해서 넣어준다.
 * (기존처럼 paddingTop: 60을 하드코딩하면 기기마다 헤더 위치가 어긋난다)
 */
export function Screen({ style, children, ...props }: ViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.screen, { paddingTop: insets.top }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

interface ScreenHeaderProps {
  title: string;
  /** 제목 아래 한 줄 설명 */
  subtitle?: string;
  /** 우측 액션 버튼 영역 */
  right?: React.ReactNode;
  /** 아래에 헤어라인을 그릴지 (스크롤 콘텐츠와 붙을 때만 true) */
  bordered?: boolean;
}

/** 좌측 정렬 큰 제목 + 우측 아이콘. 토스/당근 공통 헤더 문법. */
export function ScreenHeader({
  title,
  subtitle,
  right,
  bordered = false,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, bordered && styles.headerBordered]}>
      <View style={styles.headerTextGroup}>
        <Text style={styles.headerTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {!!right && <View style={styles.headerRight}>{right}</View>}
    </View>
  );
}

interface NavHeaderProps {
  title: string;
  /** 제목 아래 작은 보조 정보 (참여 인원 등) */
  subtitle?: string;
  onBack: () => void;
  right?: React.ReactNode;
  bordered?: boolean;
}

/**
 * 뒤로가기가 있는 상세 화면용 헤더.
 * 제목을 가운데 두되, 좌우 버튼 폭을 같게 잡아 제목이 흔들리지 않게 한다.
 */
export function NavHeader({
  title,
  subtitle,
  onBack,
  right,
  bordered = true,
}: NavHeaderProps) {
  return (
    <View style={[styles.nav, bordered && styles.headerBordered]}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [styles.navButton, pressed && { opacity: 0.5 }]}
      >
        <Ionicons name="chevron-back" size={26} color={Palette.gray800} />
      </Pressable>

      <View style={styles.navCenter}>
        <Text style={styles.navTitle} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.navSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.navRight}>{right}</View>
    </View>
  );
}

/** 섹션 사이를 나누는 두꺼운 회색 띠 (마이페이지 등 그룹 구분용) */
export function SectionGap() {
  return <View style={styles.sectionGap} />;
}

/** 리스트 항목 사이 얇은 구분선 */
export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={[styles.divider, { marginLeft: inset }]} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.light.background,
  },
  headerBordered: {
    borderBottomWidth: Hairline.height,
    borderBottomColor: Hairline.color,
  },
  headerTextGroup: { flex: 1 },
  headerTitle: Typo.display,
  headerSubtitle: {
    ...Typo.caption,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.light.background,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navCenter: { flex: 1, alignItems: "center" },
  navTitle: {
    ...Typo.subtitle,
    fontSize: 16,
  },
  navSubtitle: {
    ...Typo.caption,
    fontSize: 12,
    marginTop: 1,
  },
  navRight: {
    minWidth: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  sectionGap: {
    height: Spacing.sm,
    backgroundColor: Colors.light.backgroundMuted,
  },
  divider: {
    height: Hairline.height,
    backgroundColor: Hairline.color,
  },
});
