import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { Colors, Palette, Radius, Spacing } from "@/constants/theme";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/** 필터용 알약 버튼. 선택되면 채워지고, 아니면 테두리만. */
export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  chipSelected: {
    backgroundColor: Palette.gray900,
    borderColor: Palette.gray900,
  },
  chipPressed: { opacity: 0.6 },
  text: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: Palette.gray600,
  },
  textSelected: { color: Palette.white, fontWeight: "700" },
});

/** 게시글 본문에 붙는 해시태그. 누를 수 없는 표시용. */
export function TagPill({ label }: { label: string }) {
  return <Text style={tagStyles.tag}>{label}</Text>;
}

const tagStyles = StyleSheet.create({
  tag: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: -0.2,
    color: Palette.gray500,
    backgroundColor: Palette.gray50,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
});
