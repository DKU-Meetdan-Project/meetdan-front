import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Palette, Radius, Spacing } from "@/constants/theme";

export interface SegmentItem<T extends string> {
  value: T;
  label: string;
  /** 라벨 뒤에 붙는 개수. 0이면 표시하지 않는다. */
  count?: number;
}

interface SegmentedProps<T extends string> {
  items: SegmentItem<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * 회색 트랙 위에 흰 알약이 얹히는 토스식 세그먼트 컨트롤.
 * 밑줄 탭보다 "지금 어디"가 훨씬 분명하게 읽힌다.
 */
export function Segmented<T extends string>({
  items,
  value,
  onChange,
}: SegmentedProps<T>) {
  return (
    <View style={styles.track}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text
              style={[styles.label, active && styles.labelActive]}
              numberOfLines={1}
            >
              {item.label}
              {!!item.count && (
                <Text style={active ? styles.countActive : styles.count}>
                  {"  "}
                  {item.count}
                </Text>
              )}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: Palette.gray100,
    borderRadius: Radius.md,
    padding: 4,
    marginHorizontal: Spacing.screen,
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: Radius.sm + 2,
  },
  segmentActive: {
    backgroundColor: Palette.white,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: Palette.gray500,
  },
  labelActive: { color: Palette.gray900, fontWeight: "700" },
  count: { color: Palette.gray400 },
  countActive: { color: Palette.brand },
});
