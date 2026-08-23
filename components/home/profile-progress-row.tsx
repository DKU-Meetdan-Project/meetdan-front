// 파일: components/home/profile-progress-row.tsx
// 홈 피드에 끼는 "프로필 설정 진행도" 안내 줄.
//
// 프로필이 비어 있으면 상대 팀은 이름과 학과만 보고 신청을 받을지 정해야 한다.
// 그런데 마이 탭까지 들어가 본 사람만 그 사실을 알게 되므로, 아직 덜 채운
// 사람에게만 홈에서 한 줄로 알려준다. 다 채우면 이 줄은 사라진다.
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { FeedRow } from "@/components/home/feed-row";
import { Badge } from "@/components/ui/badge";
import { Palette, Radius, Spacing } from "@/constants/theme";
import type { ProfileProgress, ProfileStep } from "@/utils/profile-progress";

/** 팀 타일(파랑=남 / 분홍=여)과 섞이지 않게 초록을 쓴다. 진행 막대와 같은 색이다. */
const TILE = { bg: Palette.greenWeak, fg: Palette.greenText };

interface Props {
  progress: ProfileProgress;
  onPress: () => void;
}

export function ProfileProgressRow({ progress, onPress }: Props) {
  return (
    <FeedRow
      icon="person-circle"
      tile={TILE}
      tileCaption={`${progress.done}/${progress.total}`}
      title={progress.title}
      // "왜 채워야 하는지"는 본문이 아니라 메타 줄에 둔다. 본문 두 줄은
      // 무엇이 남았는지에 다 쓰는 편이 잘리지 않고 읽힌다.
      meta="내 프로필 · 상대 팀이 신청 전에 봐요"
      excerpt={progress.message}
      onPress={onPress}
      footer={
        <View style={styles.footer}>
          <View style={styles.track}>
            <View
              style={[styles.fill, { width: `${Math.round(progress.ratio * 100)}%` }]}
            />
          </View>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>프로필 설정하러 가기</Text>
            <Ionicons name="chevron-forward" size={14} color={Palette.brand} />
          </View>
        </View>
      }
    >
      {progress.steps.map((step) => (
        <StepPill key={step.key} step={step} />
      ))}
      <Badge label="프로필" />
    </FeedRow>
  );
}

/** 항목 하나. 체크 표시만으로 "뭘 했고 뭐가 남았는지"가 바로 읽힌다. */
function StepPill({ step }: { step: ProfileStep }) {
  return (
    <View style={[styles.pill, step.done && styles.pillDone]}>
      <Ionicons
        name={step.done ? "checkmark-circle" : "ellipse-outline"}
        size={13}
        color={step.done ? Palette.greenText : Palette.gray400}
      />
      <Text style={[styles.pillText, step.done && styles.pillTextDone]}>
        {step.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Palette.gray100,
  },
  pillDone: { backgroundColor: Palette.greenWeak },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: Palette.gray600,
  },
  pillTextDone: { color: Palette.greenText },

  footer: { marginTop: Spacing.md },
  track: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Palette.gray100,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Palette.green,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: Spacing.sm,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Palette.brand,
  },
});
