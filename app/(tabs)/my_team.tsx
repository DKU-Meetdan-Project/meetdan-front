// 파일: app/(tabs)/my_team.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge, BadgeTone } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PressScale } from "@/components/ui/press-scale";
import { Screen, ScreenHeader } from "@/components/ui/screen";
import {
  Colors,
  Hairline,
  Palette,
  Radius,
  Shadow,
  Spacing,
  Typo,
} from "@/constants/theme";
import { useStore, Team } from "../../store/useStore";

/** 팀 상태를 뱃지 문구/색으로 한 번에 정리 */
function teamStatus(team: Team): { label: string; tone: BadgeTone } {
  if (team.status === "ACTIVE") return { label: "공개중", tone: "solid" };
  if (team.currentCount >= team.count)
    return { label: "준비완료", tone: "success" };
  return { label: "모집중", tone: "neutral" };
}

export default function MyTeamTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    myTeams,
    deleteTeam,
    joinTeamByCode,
    toggleTeamStatus,
    simulateJoinMember,
  } = useStore();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const handleDelete = (id: number) => {
    Alert.alert("팀을 삭제할까요?", "삭제하면 되돌릴 수 없어요.", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: () => deleteTeam(id) },
    ]);
  };

  const handleJoinTeam = () => {
    if (!inputCode.trim()) {
      Alert.alert("초대 코드를 입력해주세요");
      return;
    }
    if (joinTeamByCode(inputCode)) {
      setJoinModalVisible(false);
      setInputCode("");
      Alert.alert("참가 완료", `친구 팀(${inputCode})에 합류했어요.`);
    } else {
      Alert.alert("참가할 수 없어요", "코드가 올바르지 않거나 이미 가입된 팀이에요.");
    }
  };

  const renderTeamCard = ({ item }: { item: Team }) => {
    const isFull = item.currentCount >= item.count;
    const isPublic = item.status === "ACTIVE";
    const isExpanded = expandedId === item.id;
    const status = teamStatus(item);
    const progress = Math.min(item.currentCount / item.count, 1);

    return (
      <PressScale
        scaleTo={0.985}
        style={styles.card}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <View style={styles.cardTop}>
          <Badge label={status.label} tone={status.tone} />
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={Palette.gray400}
          />
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardMeta}>
          {item.campus} · {item.dept} · 평균 {item.age}세
        </Text>

        {/* 인원 현황을 막대로 보여주면 "몇 명 더 모아야 하는지"가 즉시 읽힌다 */}
        <View style={styles.progressBlock}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>
              {isFull
                ? "인원이 다 모였어요"
                : `${item.count - item.currentCount}명만 더 모으면 돼요`}
            </Text>
            <Text style={styles.progressCount}>
              {item.currentCount}
              <Text style={styles.progressTotal}>/{item.count}</Text>
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: isFull ? Palette.green : Palette.brand,
                },
              ]}
            />
          </View>
        </View>

        {isExpanded && (
          <View style={styles.detail}>
            <View style={styles.codeBox}>
              <View>
                <Text style={styles.codeLabel}>초대 코드</Text>
                <Text style={styles.codeValue}>
                  {item.inviteCode || "없음"}
                </Text>
              </View>
              <Ionicons
                name="ticket-outline"
                size={22}
                color={Palette.gray400}
              />
            </View>

            {isFull ? (
              <Pressable
                onPress={() => toggleTeamStatus(item.id, !isPublic)}
                style={({ pressed }) => [
                  styles.primaryAction,
                  isPublic && styles.secondaryAction,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text
                  style={[
                    styles.primaryActionText,
                    isPublic && styles.secondaryActionText,
                  ]}
                >
                  {isPublic ? "비공개로 돌리기" : "게시판에 등록하기"}
                </Text>
              </Pressable>
            ) : (
              <View style={styles.lockedBox}>
                <Ionicons
                  name="lock-closed"
                  size={15}
                  color={Palette.gray500}
                />
                <Text style={styles.lockedText}>
                  팀원이 다 모여야 공개할 수 있어요
                </Text>
              </View>
            )}

            <View style={styles.manageRow}>
              <Pressable
                style={styles.manageBtn}
                onPress={() => router.push(`/edit/${item.id}` as any)}
              >
                <Ionicons name="create-outline" size={17} color={Palette.gray600} />
                <Text style={styles.manageText}>정보 수정</Text>
              </Pressable>

              <View style={styles.manageDivider} />

              <Pressable
                style={styles.manageBtn}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={17} color={Palette.red} />
                <Text style={[styles.manageText, { color: Palette.red }]}>
                  팀 삭제
                </Text>
              </Pressable>
            </View>

            {!isFull && (
              <Pressable
                onPress={() => simulateJoinMember(item.id)}
                style={styles.devBtn}
              >
                <Text style={styles.devText}>🧪 (테스트) 친구 입장시키기</Text>
              </Pressable>
            )}
          </View>
        )}
      </PressScale>
    );
  };

  return (
    <Screen>
      <ScreenHeader title="내 팀" subtitle="만든 팀과 참여한 팀을 관리해요" />

      <View style={styles.actionRow}>
        <PressScale
          scaleTo={0.96}
          style={[styles.actionCard, styles.actionCardBrand]}
          onPress={() => router.push("/write")}
        >
          <Ionicons name="add-circle" size={22} color={Palette.brand} />
          <Text style={[styles.actionText, { color: Palette.brandText }]}>
            팀 만들기
          </Text>
        </PressScale>

        <PressScale
          scaleTo={0.96}
          style={styles.actionCard}
          onPress={() => setJoinModalVisible(true)}
        >
          <Ionicons name="ticket" size={22} color={Palette.gray600} />
          <Text style={styles.actionText}>코드로 참여</Text>
        </PressScale>
      </View>

      <FlatList
        data={myTeams}
        renderItem={renderTeamCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="아직 만든 팀이 없어요"
            description="팀을 만들고 초대 코드로 친구를 부르면 과팅을 시작할 수 있어요."
            actionLabel="첫 팀 만들기"
            onAction={() => router.push("/write")}
          />
        }
      />

      {/* 초대 코드 입력: 아래에서 올라오는 시트 */}
      <Modal
        visible={joinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setJoinModalVisible(false)}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>초대 코드 입력</Text>
          <Text style={styles.sheetDesc}>
            친구에게 받은 6자리 코드를 입력해주세요.
          </Text>

          <TextInput
            style={styles.codeInput}
            placeholder="X7A9Z2"
            placeholderTextColor={Palette.gray400}
            value={inputCode}
            onChangeText={(t) => setInputCode(t.toUpperCase())}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
          />

          <Pressable
            onPress={handleJoinTeam}
            disabled={!inputCode.trim()}
            style={({ pressed }) => [
              styles.sheetSubmit,
              !inputCode.trim() && styles.sheetSubmitDisabled,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              style={[
                styles.sheetSubmitText,
                !inputCode.trim() && { color: Palette.gray400 },
              ]}
            >
              입장하기
            </Text>
          </Pressable>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Palette.gray100,
  },
  actionCardBrand: { backgroundColor: Palette.brandWeak },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Palette.gray700,
  },

  listContent: { paddingHorizontal: Spacing.screen, paddingBottom: Spacing.xxxl },

  card: {
    backgroundColor: Palette.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  cardTitle: Typo.subtitle,
  cardMeta: { ...Typo.caption, marginTop: 4 },

  progressBlock: { marginTop: Spacing.lg },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: Palette.gray600,
  },
  progressCount: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Palette.gray900,
  },
  progressTotal: { color: Palette.gray400, fontSize: 13 },
  progressTrack: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Palette.gray100,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: Radius.full },

  detail: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: Hairline.height,
    borderTopColor: Hairline.color,
    gap: Spacing.md,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Palette.gray50,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  codeLabel: { ...Typo.caption, fontSize: 12 },
  codeValue: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 2,
    color: Palette.gray900,
    marginTop: 2,
  },

  primaryAction: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Palette.brand,
    alignItems: "center",
  },
  primaryActionText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  secondaryAction: { backgroundColor: Palette.gray100 },
  secondaryActionText: { color: Palette.gray700 },

  lockedBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Palette.gray50,
  },
  lockedText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: Palette.gray500,
  },

  manageRow: { flexDirection: "row", alignItems: "center" },
  manageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: Spacing.sm,
  },
  manageText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
    color: Palette.gray600,
  },
  manageDivider: { width: 1, height: 14, backgroundColor: Palette.gray200 },

  devBtn: { alignItems: "center", paddingVertical: Spacing.xs },
  devText: { fontSize: 12, color: Palette.gray400 },

  sheetBackdrop: { flex: 1, backgroundColor: "rgba(25,31,40,0.45)" },
  sheet: {
    backgroundColor: Palette.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    ...Shadow.modal,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Palette.gray200,
    marginBottom: Spacing.xl,
  },
  sheetTitle: Typo.title,
  sheetDesc: { ...Typo.caption, marginTop: 6, marginBottom: Spacing.xl },
  codeInput: {
    backgroundColor: Palette.gray100,
    borderRadius: Radius.md,
    paddingVertical: Spacing.lg,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 6,
    color: Palette.gray900,
    marginBottom: Spacing.md,
  },
  sheetSubmit: {
    paddingVertical: 17,
    borderRadius: Radius.md,
    backgroundColor: Palette.brand,
    alignItems: "center",
  },
  sheetSubmitDisabled: { backgroundColor: Palette.gray100 },
  sheetSubmitText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
