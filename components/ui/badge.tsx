import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { Palette, Radius, Spacing } from "@/constants/theme";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "danger"
  | "warn"
  | "solid";

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: Palette.gray100, fg: Palette.gray600 },
  brand: { bg: Palette.brandWeak, fg: Palette.brandText },
  success: { bg: Palette.greenWeak, fg: "#0E9F5B" },
  danger: { bg: Palette.redWeak, fg: Palette.red },
  warn: { bg: Palette.orangeWeak, fg: "#D97400" },
  solid: { bg: Palette.brand, fg: Palette.white },
};

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  /** 토큰 색 대신 직접 지정하고 싶을 때 */
  colors?: { bg: string; fg: string };
  style?: ViewStyle;
}

/** 캠퍼스·학과·상태처럼 짧은 메타 정보를 감싸는 작은 알약. */
export function Badge({ label, tone = "neutral", colors, style }: BadgeProps) {
  const c = colors ?? TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, style]}>
      <Text style={[styles.text, { color: c.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
