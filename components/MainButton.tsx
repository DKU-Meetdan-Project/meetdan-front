import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Colors } from "@/constants/theme"; // 테마 컬러 가져오기

interface MainButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

export const MainButton = ({
  title,
  isLoading = false,
  style,
  ...props
}: MainButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      disabled={isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary, // 테마에서 색상 가져옴
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
