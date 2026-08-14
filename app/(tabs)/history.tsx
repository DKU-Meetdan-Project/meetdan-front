// 파일: app/(tabs)/history.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PressScale } from "@/components/ui/press-scale";
import { Divider, Screen, ScreenHeader } from "@/components/ui/screen";
import { Segmented } from "@/components/ui/segmented";
import { Palette, Radius, Spacing, Typo } from "@/constants/theme";
import { Match, Team, useStore } from "../../store/useStore";

type TabType = "RECEIVED" | "SENT" | "MATCHES";

interface RequestRow {
  id: number;
  timestamp: string;
  team: Team;
  received: boolean;
}

export default function HistoryTab() {
  const router = useRouter();
  const { receivedRequests, sentRequests, posts, matches } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>("RECEIVED");

  // 신청 데이터에 상대 팀 정보를 붙이고, 찾지 못한 건 걸러낸다
  const receivedList = useMemo<RequestRow[]>(
    () =>
      receivedRequests
        .map((req) => ({
          id: req.id,
          timestamp: req.timestamp,
          team: posts.find((p) => p.id === req.senderTeamId)!,
          received: true,
        }))
        .filter((r) => !!r.team),
    [receivedRequests, posts],
  );

  const sentList = useMemo<RequestRow[]>(
    () =>
      sentRequests
        .map((req) => ({
          id: req.id,
          timestamp: req.timestamp,
          team: posts.find((p) => p.id === req.receiverTeamId)!,
          received: false,
        }))
        .filter((r) => !!r.team),
    [sentRequests, posts],
  );

  const renderRequestItem = ({ item }: { item: RequestRow }) => {
    const { team, received } = item;

    return (
      <PressScale
        scaleTo={0.98}
        style={styles.row}
        disabled={!received}
        onPress={() =>
          received && router.push(`/match/party/${team.id}` as any)
        }
      >
        <View style={styles.avatarWrap}>
          <View
            style={[styles.avatar, !received && styles.avatarMuted]}
            >
            <Text style={[styles.avatarText, !received && styles.avatarTextMuted]}>
              {team.title.charAt(0)}
            </Text>
          </View>
          {received && <View style={styles.newDot} />}
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
            <Badge
              label={received ? "신청 도착" : "수락 대기중"}
              tone={received ? "brand" : "neutral"}
            />
            <Text style={styles.statusHint}>
              {received
                ? "확인하고 수락해보세요"
                : "성사되면 알림을 보내드릴게요"}
            </Text>
          </View>
        </View>

        {received && (
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

  const renderMatchItem = ({ item }: { item: Match }) => (
    <PressScale
      scaleTo={0.98}
      style={styles.row}
      onPress={() => router.push(`/chat/${item.id}` as any)}
    >
      <View style={[styles.avatar, styles.avatarBrand]}>
        <Ionicons name="chatbubbles" size={20} color={Palette.brand} />
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.title} numberOfLines={1}>
            {item.partnerTeamName}
          </Text>
          <Text style={styles.time}>{item.startedAt}</Text>
        </View>
        <Text style={styles.meta}>매칭 성사 · 대화를 시작해보세요</Text>
        <View style={styles.statusRow}>
          <Badge label="채팅중" tone="success" />
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={Palette.gray300}
        style={styles.chevron}
      />
    </PressScale>
  );

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
          data={matches}
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
});
