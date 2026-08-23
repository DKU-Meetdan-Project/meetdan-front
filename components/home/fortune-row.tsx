// 파일: components/home/fortune-row.tsx
// 홈 피드에 하루 한 줄 끼어드는 "오늘의 연애 운세".
//
// 초기에는 공개된 팀이 몇 개 없어서 홈이 텅 빈 채로 열린다. 빈 화면에
// 안내 문구를 크게 띄우면 "여기 아무것도 없다"만 더 커 보인다. 대신
// 매일 바뀌는 읽을거리를 팀 글과 같은 골격으로 한 줄 넣어, 내려볼 것이
// 있는 화면으로 만든다.
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { FeedRow } from "@/components/home/feed-row";
import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/components/ui/badge";
import { Palette, Radius, Spacing, Typo } from "@/constants/theme";
import type { DailyFortune, FortuneTier } from "@/utils/fortune";

/**
 * 타일은 주황이다. 파랑·분홍은 이미 남자팀·여자팀 타일이 쓰고 있어서,
 * 운세에 분홍을 주면 목록에서 여자팀 글로 착각한다.
 */
const TILE = { bg: Palette.orangeWeak, fg: Palette.orangeText };

const TIER_TONE: Record<FortuneTier, BadgeTone> = {
  great: "warn",
  good: "brand",
  soso: "neutral",
};

export function FortuneRow({ fortune }: { fortune: DailyFortune }) {
  return (
    <FeedRow
      icon="sparkles"
      tile={TILE}
      tileCaption={`${fortune.score}점`}
      title="오늘의 연애 운세"
      meta={`${fortune.dateLabel} · 나에게만 보여요`}
      excerpt={fortune.message}
      footer={
        <View style={styles.lucky}>
          <LuckyCell label="행운의 시간" value={fortune.luckyTime} />
          <LuckyCell label="행운의 MBTI" value={fortune.luckyMbti} />
          <LuckyCell label="행운의 장소" value={fortune.luckyPlace} />
        </View>
      }
    >
      <Badge label={fortune.headline} tone={TIER_TONE[fortune.tier]} />
      <Badge label="운세" />
    </FeedRow>
  );
}

function LuckyCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.cellValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lucky: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Palette.gray100,
  },
  cell: { flex: 1 },
  cellLabel: {
    ...Typo.label,
    fontSize: 11,
    fontWeight: "600",
    color: Palette.gray500,
  },
  cellValue: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 17,
    color: Palette.gray800,
    marginTop: 2,
  },
});
