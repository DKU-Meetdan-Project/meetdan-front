// 파일: app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Badge } from "@/components/ui/badge";
import { Chip, TagPill } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { PressScale } from "@/components/ui/press-scale";
import { Divider, Screen, ScreenHeader } from "@/components/ui/screen";
import {
  CampusColor,
  GenderColor,
  Palette,
  Radius,
  Shadow,
  Spacing,
  Typo,
} from "@/constants/theme";
import { useStore, Team } from "../../store/useStore";

type CampusFilter = "전체" | "죽전" | "천안";
const CAMPUS_FILTERS: CampusFilter[] = ["전체", "죽전", "천안"];

export default function HomeTab() {
  const router = useRouter();
  const { posts } = useStore();
  const currentUser = useStore((state) => state.currentUser);

  const [data, setData] = useState<Team[]>([]);
  // 기본값은 내 캠퍼스. 아직 내 정보가 안 왔으면 전체로 두고 도착하면 한 번만 맞춘다.
  const [campus, setCampus] = useState<CampusFilter>(
    currentUser?.campus ?? "전체",
  );
  const didApplyMyCampus = useRef(currentUser != null);

  useEffect(() => {
    if (didApplyMyCampus.current || !currentUser) return;
    didApplyMyCampus.current = true;
    setCampus(currentUser.campus);
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      setData(posts.filter((p) => p.status === "ACTIVE"));
    }, [posts]),
  );

  const visible = useMemo(
    () => (campus === "전체" ? data : data.filter((t) => t.campus === campus)),
    [data, campus],
  );

  const renderItem = ({ item }: { item: Team }) => {
    const gender = GenderColor[item.gender];
    const campusTone = CampusColor[item.campus];

    return (
      <PressScale
        scaleTo={0.98}
        style={styles.row}
        onPress={() => router.push(`/post/${item.id}` as any)}
      >
        {/* 좌측: 성별을 한눈에 읽히게 하는 색 타일 */}
        <View style={[styles.tile, { backgroundColor: gender.bg }]}>
          <Ionicons name={gender.icon} size={22} color={gender.fg} />
          <Text style={[styles.tileCount, { color: gender.fg }]}>
            {item.count}명
          </Text>
        </View>

        <View style={styles.rowBody}>
          <View style={styles.rowTop}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>

          <Text style={styles.meta} numberOfLines={1}>
            {item.dept} · 평균 {item.age}세
          </Text>

          <View style={styles.badgeRow}>
            <Badge label={item.campus} colors={campusTone} />
            {item.tags?.slice(0, 2).map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </View>
        </View>
      </PressScale>
    );
  };

  return (
    <Screen>
      <ScreenHeader
        title="밋단"
        right={
          <Pressable
            hitSlop={8}
            style={styles.iconButton}
            onPress={() => router.push("/temp/temp_notification" as any)}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Palette.gray800}
            />
          </Pressable>
        }
      />

      <View style={styles.filterRow}>
        {CAMPUS_FILTERS.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={campus === c}
            onPress={() => setCampus(c)}
          />
        ))}
      </View>

      <FlatList
        data={visible}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Divider inset={Spacing.screen} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="sparkles-outline"
            title="아직 열린 과팅이 없어요"
            description={
              campus === "전체"
                ? "첫 번째 팀을 만들어 상대를 기다려보세요."
                : `${campus} 캠퍼스에 올라온 팀이 없어요.`
            }
            actionLabel="팀 만들기"
            onAction={() => router.push("/write")}
          />
        }
      />

      {/* 글쓰기는 헤더 구석의 작은 아이콘보다 떠 있는 버튼이 훨씬 잘 눌린다 */}
      <PressScale
        scaleTo={0.94}
        style={styles.fab}
        onPress={() => router.push("/write")}
      >
        <Ionicons name="add" size={22} color={Palette.white} />
        <Text style={styles.fabText}>팀 만들기</Text>
      </PressScale>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconButton: { padding: 4 },

  filterRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.lg,
  },

  listContent: { paddingBottom: 96 },

  row: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.screen,
    paddingVertical: Spacing.lg,
    backgroundColor: Palette.white,
  },
  tile: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  tileCount: { fontSize: 11, fontWeight: "700", letterSpacing: -0.2 },

  rowBody: { flex: 1, justifyContent: "center" },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  title: { ...Typo.subtitle, fontSize: 16, flex: 1 },
  time: { ...Typo.caption, fontSize: 12, color: Palette.gray400 },
  meta: { ...Typo.caption, marginTop: 3 },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: Spacing.sm,
  },

  fab: {
    position: "absolute",
    right: Spacing.screen,
    bottom: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xl,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Palette.brand,
    ...Shadow.soft,
  },
  fabText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
