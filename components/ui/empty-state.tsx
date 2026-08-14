import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Palette, Radius, Spacing, Typo } from "@/constants/theme";

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** 목록이 비었을 때. 상황 설명 한 줄 + 다음 행동 버튼까지 같이 준다. */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={28} color={Palette.gray400} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
      {!!actionLabel && !!onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 72,
    paddingHorizontal: Spacing.xxxl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Palette.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typo.subtitle,
    fontSize: 16,
    textAlign: "center",
  },
  description: {
    ...Typo.caption,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },
  action: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Palette.brandWeak,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Palette.brandText,
  },
});
