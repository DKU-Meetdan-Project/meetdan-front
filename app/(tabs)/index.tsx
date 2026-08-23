// 파일: app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { API } from "@/api/client";
import { FeedRow } from "@/components/home/feed-row";
import { FortuneRow } from "@/components/home/fortune-row";
import { ProfileProgressRow } from "@/components/home/profile-progress-row";
import MeetDanLogo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Chip, TagPill } from "@/components/ui/chip";
import { EmptyHint, EmptyState } from "@/components/ui/empty-state";
import { PressScale } from "@/components/ui/press-scale";
import { Divider, Screen, ScreenHeader } from "@/components/ui/screen";
import {
  GenderColor,
  Palette,
  Radius,
  Shadow,
  Spacing,
  Typo,
} from "@/constants/theme";
import { getDailyFortune } from "@/utils/fortune";
import { getProfileProgress } from "@/utils/profile-progress";
import { useStore, Team } from "../../store/useStore";

type CampusFilter = "전체" | "죽전" | "천안";
const CAMPUS_FILTERS: CampusFilter[] = ["전체", "죽전", "천안"];

/**
 * 홈에 놓이는 줄의 종류.
 *
 * 서비스 초기에는 공개된 팀이 몇 개 없어서 홈이 거의 빈 채로 열린다.
 * 팀 글만 그리면 "아직 아무것도 없다"는 사실만 크게 보이므로, 매일 바뀌는
 * 운세와 프로필 안내를 같은 목록 안에 섞는다. 별도 영역(헤더 배너 등)이
 * 아니라 목록의 한 줄로 넣는 이유는, 팀 글이 늘어나면 자연스럽게 아래로
 * 밀려나 결국 팀 글이 화면을 차지하게 하기 위해서다.
 */
type FeedItem =
  | { key: string; kind: "team"; team: Team }
  | { key: string; kind: "fortune" }
  | { key: string; kind: "profile" };

/** 운세를 몇 번째 팀 글 뒤에 끼울지. 팀 글이 이보다 적으면 그 뒤에 바로 붙는다. */
const FORTUNE_SLOT = 3;

/** 하루가 바뀌었는지만 보면 되므로 시:분은 버린다. */
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export default function HomeTab() {
  const router = useRouter();
  const posts = useStore((state) => state.posts);
  const setPosts = useStore((state) => state.setPosts);
  const currentUser = useStore((state) => state.currentUser);
  const unreadCount = useStore((state) => state.unreadCount);
  const setUnreadCount = useStore((state) => state.setUnreadCount);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 운세는 날짜가 씨앗이다. 앱을 켜둔 채 자정을 넘기는 사람이 있으므로
  // 탭에 들어올 때마다 날이 바뀌었는지 확인한다. 같은 날이면 이전 Date를
  // 그대로 두어(=참조가 안 바뀌어) 운세를 다시 계산하지 않는다.
  const [today, setToday] = useState(() => new Date());

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

  /**
   * 게시판은 서버가 유일한 출처다. 무엇이 보이는지(공개 팀만, 차단 제외,
   * 내 팀 제외)는 전부 API.getPosts 안에서 정해지므로 여기서 더 거르지 않는다.
   */
  const reload = useCallback(async () => {
    // 안 읽은 알림 개수도 같이 물어본다. 평소에는 Realtime 구독(_layout.tsx)이
    // 뱃지를 실시간으로 올리지만, 앱이 백그라운드에 있는 동안 구독이 끊겼다
    // 붙으면 그 사이 도착한 알림을 놓친다. 홈에 돌아올 때마다 한 번씩 맞춘다.
    const [result, unread] = await Promise.all([
      API.getPosts(),
      API.getUnreadNotificationCount(),
    ]);

    if (unread.code === 200 && unread.data !== undefined) {
      setUnreadCount(unread.data);
    }

    if (result.code !== 200 || !result.data) {
      // 401(세션 만료)은 _layout.tsx 가 로그인 화면으로 보내므로 조용히 둔다.
      if (result.code !== 401) {
        Alert.alert("오류", result.message ?? "게시글을 불러오지 못했어요.");
      }
      return;
    }
    setPosts(result.data);
  }, [setPosts, setUnreadCount]);

  // 다른 팀이 방금 공개됐을 수도, 내가 신청한 팀이 매칭되어 내려갔을 수도 있다.
  // 탭에 들어올 때마다 다시 읽는다.
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setToday((prev) => {
        const now = new Date();
        return dayKey(prev) === dayKey(now) ? prev : now;
      });
      (async () => {
        await reload();
        if (alive) setIsLoading(false);
      })();
      return () => {
        alive = false;
      };
    }, [reload]),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await reload();
    setIsRefreshing(false);
  };

  const visible = useMemo(
    () => (campus === "전체" ? posts : posts.filter((t) => t.campus === campus)),
    [posts, campus],
  );

  // 같은 사람·같은 날이면 늘 같은 운세다. 새로고침할 때마다 점수가 바뀌면
  // 그건 운세가 아니라 난수 표시기라서, 계산은 유저와 날짜에만 매단다.
  const fortune = useMemo(
    () =>
      currentUser
        ? getDailyFortune({
            userId: currentUser.id,
            campus: currentUser.campus,
            now: today,
          })
        : null,
    [currentUser, today],
  );

  // 다 채운 사람에게는 null 이 아니라 isComplete 로 돌아온다. 그 줄은 그리지 않는다.
  const progress = useMemo(
    () => getProfileProgress(currentUser),
    [currentUser],
  );

  /**
   * 팀 글 사이에 운세·프로필 안내를 끼운 최종 목록.
   *
   * 프로필 안내가 맨 위인 건 "지금 당장 할 수 있는 일"이기 때문이고,
   * 운세는 팀 글 세 개 뒤로 넣는다. 팀 글이 쌓이기 시작하면 읽을거리가
   * 목록 위쪽을 차지하지 않아야 한다.
   */
  const feed = useMemo<FeedItem[]>(() => {
    const teams: FeedItem[] = visible.map((team) => ({
      key: `team:${team.id}`,
      kind: "team",
      team,
    }));

    const items: FeedItem[] = [];
    if (progress && !progress.isComplete) {
      items.push({ key: "profile", kind: "profile" });
    }
    items.push(...teams.slice(0, FORTUNE_SLOT));
    if (fortune) {
      items.push({ key: "fortune", kind: "fortune" });
    }
    items.push(...teams.slice(FORTUNE_SLOT));
    return items;
  }, [visible, progress, fortune]);

  const renderItem = ({ item }: { item: FeedItem }) => {
    if (item.kind === "fortune") {
      return fortune ? <FortuneRow fortune={fortune} /> : null;
    }

    if (item.kind === "profile") {
      return progress ? (
        <ProfileProgressRow
          progress={progress}
          // 탭 이동이라 push가 아니라 navigate. 홈 위에 마이 탭이 쌓이면
          // 뒤로가기 동작이 탭바와 어긋난다.
          onPress={() => router.navigate("/(tabs)/profile" as any)}
        />
      ) : null;
    }

    const team = item.team;
    const gender = GenderColor[team.gender];
    const full = team.currentCount >= team.count;

    return (
      <FeedRow
        icon={gender.icon}
        tile={gender}
        tileCaption={`${team.currentCount}/${team.count}`}
        title={team.title}
        // 당근이 "동네 · 시간"을 한 줄에 몰아넣는 자리.
        // 캠퍼스·학과·평균나이·올라온 시각을 한 줄로 붙인다.
        meta={[
          `${team.campus} · ${team.dept}`,
          team.age != null ? `평균 ${team.age}세` : null,
          team.timestamp,
        ]
          .filter(Boolean)
          .join(" · ")}
        // 소개 미리보기. 목록에서 팀 성격이 드러나야 들어가 볼 마음이 든다.
        excerpt={team.content?.trim() || undefined}
        onPress={() => router.push(`/post/${team.id}` as any)}
      >
        {full ? (
          <Badge label="모집 완료" tone="success" />
        ) : (
          <Badge label={`${team.count - team.currentCount}자리 남음`} />
        )}
        {team.tags?.slice(0, 2).map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </FeedRow>
    );
  };

  return (
    <Screen>
      <ScreenHeader
        title={
          <View style={styles.brand}>
            <MeetDanLogo size={30} showText={false} />
            <Text style={styles.brandName}>밋단</Text>
          </View>
        }
        subtitle="단국대 과팅, 팀으로 만나요"
        right={
          <Pressable
            hitSlop={8}
            style={styles.iconButton}
            onPress={() => router.push("/notifications" as any)}
          >
            <Ionicons
              name={unreadCount > 0 ? "notifications" : "notifications-outline"}
              size={24}
              color={unreadCount > 0 ? Palette.brand : Palette.gray700}
            />
            {/* 개수까지 적지 않는다. 몇 개인지는 들어가서 보면 되고,
                작은 점 하나가 "뭔가 있다"를 가장 조용히 말한다. */}
            {unreadCount > 0 && <View style={styles.unreadDot} />}
          </Pressable>
        }
      />

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Palette.brand} />
        </View>
      ) : (
        <FlatList
          data={feed}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Palette.brand}
            />
          }
          ItemSeparatorComponent={() => <Divider inset={Spacing.screen} />}
          ListHeaderComponent={
            <View>
              {/* 필터는 스크롤을 따라 올라간다. 목록이 주인공이라 위쪽을
                  고정 요소로 채우지 않는다. */}
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
              <Divider />
            </View>
          }
          // 운세·프로필 줄이 있어서 목록 자체는 비지 않는다. 그래서
          // ListEmptyComponent 대신 "팀 글이 없을 때"를 직접 따져 맨 아래에 붙인다.
          ListFooterComponent={
            visible.length === 0 ? (
              <View>
                <Divider />
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
                >
                  <EmptyHint
                    icon="people-outline"
                    text="팀은 2~4명까지 모을 수 있어요"
                  />
                  <EmptyHint
                    icon="ticket-outline"
                    text="초대 코드로 친구를 부를 수 있어요"
                  />
                </EmptyState>
              </View>
            ) : null
          }
        />
      )}

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
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  brandName: Typo.display,

  iconButton: { padding: 4 },
  unreadDot: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Palette.red,
    // 아이콘 획과 점이 붙어 보이지 않게 배경색으로 한 겹 띄운다
    borderWidth: 1.5,
    borderColor: Palette.white,
  },

  loading: { flex: 1, alignItems: "center", justifyContent: "center" },

  filterRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.md,
  },

  listContent: { paddingBottom: 108 },

  // 목록 한 줄의 모양(색 타일 + 제목/메타/미리보기)은 components/home/feed-row.tsx
  // 한곳에 있다. 팀 글·운세·프로필 안내가 같은 골격을 써야 하기 때문이다.

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
