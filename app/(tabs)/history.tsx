// 파일: app/(tabs)/history.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PressScale } from "@/components/ui/press-scale";
import { Divider, Screen, ScreenHeader } from "@/components/ui/screen";
import { Segmented } from "@/components/ui/segmented";
import { Palette, Radius, Spacing, Typo } from "@/constants/theme";
import { dDayLabel, formatPlanSummary, isPastPlan } from "@/utils/plan";
import { Match, RequestData, Team, useStore } from "../../store/useStore";

type TabType = "RECEIVED" | "SENT" | "MATCHES";

interface RequestRow {
  id: number;
  timestamp: string;
  team: Team;
  received: boolean;
  status: RequestData["status"];
}

/** 신청 상태별로 보여줄 뱃지와 안내 문구 */
const requestStatusView = (row: RequestRow) => {
  if (row.status === "ACCEPTED") {
    return {
      label: "수락함",
      tone: "success" as const,
      hint: "매칭 탭에서 대화를 이어가세요",
    };
  }
  if (row.status === "REJECTED") {
    return {
      label: "거절함",
      tone: "neutral" as const,
      hint: "거절한 신청이에요",
    };
  }
  return row.received
    ? {
        label: "신청 도착",
        tone: "brand" as const,
        hint: "확인하고 수락해보세요",
      }
    : {
        label: "수락 대기중",
        tone: "neutral" as const,
        hint: "성사되면 알림을 보내드릴게요",
      };
};

export default function HistoryTab() {
  const router = useRouter();
  const { receivedRequests, sentRequests, posts, myTeams, matches } =
    useStore();
  const [activeTab, setActiveTab] = useState<TabType>("RECEIVED");

  // 게시판에서 내려간 팀도 신청 기록에는 남아야 하므로 내 팀 목록까지 뒤진다
  const findTeam = useMemo(
    () => (teamId: number) =>
      posts.find((p) => p.id === teamId) ??
      myTeams.find((t) => t.id === teamId),
    [posts, myTeams],
  );

  // 신청 데이터에 상대 팀 정보를 붙이고, 찾지 못한 건 걸러낸다
  const receivedList = useMemo<RequestRow[]>(
    () =>
      receivedRequests
        .map((req) => ({
          id: req.id,
          timestamp: req.timestamp,
          team: findTeam(req.senderTeamId)!,
          received: true,
          status: req.status,
        }))
        .filter((r) => !!r.team),
    [receivedRequests, findTeam],
  );

  const sentList = useMemo<RequestRow[]>(
    () =>
      sentRequests
        .map((req) => ({
          id: req.id,
          timestamp: req.timestamp,
          team: findTeam(req.receiverTeamId)!,
          received: false,
          status: req.status,
        }))
        .filter((r) => !!r.team),
    [sentRequests, findTeam],
  );

  const renderRequestItem = ({ item }: { item: RequestRow }) => {
    const { team, received, status } = item;
    // 아직 답을 안 한 '받은 신청'만 상세로 들어가 수락/거절할 수 있다
    const actionable = received && status === "WAITING";
    const muted = !received || status !== "WAITING";
    const view = requestStatusView(item);

    return (
      <PressScale
        scaleTo={0.98}
        style={styles.row}
        disabled={!actionable}
        onPress={() =>
          actionable && router.push(`/match/party/${team.id}` as any)
        }
      >
        <View style={styles.avatarWrap}>
          <View
            style={[styles.avatar, muted && styles.avatarMuted]}
            >
            <Text style={[styles.avatarText, muted && styles.avatarTextMuted]}>
              {team.title.charAt(0)}
            </Text>
          </View>
          {actionable && <View style={styles.newDot} />}
        </View>

        <View style={styles.rowBody}>
          <View style={styles.rowTop}>
            <Text style={styles.title} numberOfLines={1}>
              {team.title}
            </Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>

          <Text style={styles.meta} numberOfLines={1}>
            {team.campus} · {team.dept} · {team.count}명
          </Text>

          <View style={styles.statusRow}>
            <Badge label={view.label} tone={view.tone} />
            <Text style={styles.statusHint}>{view.hint}</Text>
          </View>
        </View>

        {actionable && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Palette.gray300}
            style={styles.chevron}
          />
        )}
      </PressScale>
    );
  };

  // 약속 날짜가 지난 매칭은 아래로 내린다. 다음에 만날 약속이 위에 보여야 한다.
  const sortedMatches = useMemo(() => {
    const done = (m: Match) => !!m.confirmedPlan && isPastPlan(m.confirmedPlan.date);
    return [...matches].sort(
      (a, b) => Number(done(a)) - Number(done(b)),
    );
  }, [matches]);

  const renderMatchItem = ({ item }: { item: Match }) => {
    const plan = item.confirmedPlan;
    const completed = !!plan && isPastPlan(plan.date);

    return (
      <View style={completed && styles.completedCard}>
        <PressScale
          scaleTo={0.98}
          style={styles.row}
          onPress={() => router.push(`/chat/${item.id}` as any)}
        >
          <View
            style={[
              styles.avatar,
              completed ? styles.avatarDone : styles.avatarBrand,
            ]}
          >
            <Ionicons
              name={completed ? "checkmark-done" : "chatbubbles"}
              size={20}
              color={completed ? Palette.gray500 : Palette.brand}
            />
          </View>

          <View style={styles.rowBody}>
            <View style={styles.rowTop}>
              <Text
                style={[styles.title, completed && styles.titleDone]}
                numberOfLines={1}
              >
                {item.partnerTeamName}
              </Text>
              <Text style={styles.time}>{item.startedAt}</Text>
            </View>

            <Text style={styles.meta} numberOfLines={1}>
              {plan
                ? formatPlanSummary(plan)
                : "매칭 성사 · 대화를 시작해보세요"}
            </Text>

            <View style={styles.statusRow}>
              {completed ? (
                <Badge label="완료됨" tone="neutral" />
              ) : plan ? (
                <Badge label={`약속 ${dDayLabel(plan.date)}`} tone="brand" />
              ) : (
                <Badge label="채팅중" tone="success" />
              )}
              {!plan && (
                <Text style={styles.statusHint}>
                  만날 날짜를 정하면 여기에 표시돼요
                </Text>
              )}
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={Palette.gray300}
            style={styles.chevron}
          />
        </PressScale>

        {completed && (
          <View style={styles.reviewRow}>
            <Pressable
              onPress={() =>
                Alert.alert("준비중입니다", "후기 기능은 곧 만나볼 수 있어요.")
              }
              style={({ pressed }) => [
                styles.reviewButton,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={Palette.gray700}
              />
              <Text style={styles.reviewButtonText}>후기 남기기</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  const emptyByTab = {
    RECEIVED: {
      icon: "mail-outline" as const,
      title: "받은 신청이 없어요",
      description: "팀을 게시판에 공개하면 신청을 받을 수 있어요.",
    },
    SENT: {
      icon: "paper-plane-outline" as const,
      title: "보낸 신청이 없어요",
      description: "마음에 드는 팀에 먼저 신청해보세요.",
    },
    MATCHES: {
      icon: "chatbubbles-outline" as const,
      title: "성사된 매칭이 없어요",
      description: "신청을 수락하면 여기에서 바로 대화할 수 있어요.",
    },
  }[activeTab];

  return (
    <Screen>
      <ScreenHeader title="활동" />

      <Segmented<TabType>
        value={activeTab}
        onChange={setActiveTab}
        items={[
          { value: "RECEIVED", label: "받은 신청", count: receivedList.length },
          { value: "SENT", label: "보낸 신청", count: sentList.length },
          { value: "MATCHES", label: "매칭", count: matches.length },
        ]}
      />

      {activeTab === "MATCHES" ? (
        <FlatList
          data={sortedMatches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Divider inset={76} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState {...emptyByTab} />}
        />
      ) : (
        <FlatList
          data={activeTab === "RECEIVED" ? receivedList : sentList}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Divider inset={76} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState {...emptyByTab} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingTop: Spacing.sm, paddingBottom: Spacing.xxxl },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.screen,
    paddingVertical: Spacing.lg,
    backgroundColor: Palette.white,
  },

  avatarWrap: { position: "relative" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Palette.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMuted: { backgroundColor: Palette.gray50 },
  avatarBrand: { backgroundColor: Palette.brandWeak },
  avatarDone: { backgroundColor: Palette.gray100 },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Palette.gray700,
  },
  avatarTextMuted: { color: Palette.gray400 },
  newDot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Palette.red,
    borderWidth: 2,
    borderColor: Palette.white,
  },

  rowBody: { flex: 1 },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  title: { ...Typo.subtitle, fontSize: 16, flex: 1 },
  time: { ...Typo.caption, fontSize: 12, color: Palette.gray400 },
  meta: { ...Typo.caption, marginTop: 3 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  statusHint: { ...Typo.caption, fontSize: 12, flexShrink: 1 },
  chevron: { marginLeft: -Spacing.xs },

  // 지난 약속: 흐리게 눕혀두고 후기 버튼만 또렷하게
  completedCard: { backgroundColor: Palette.gray50 },
  titleDone: { color: Palette.gray600 },
  reviewRow: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.gray200,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Palette.gray700,
  },
});
