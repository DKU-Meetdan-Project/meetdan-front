/**
 * constants/theme.ts
 */
import { Platform } from "react-native";

const tintColorLight = "#3288FF"; // 여기도 단국대 블루로 변경됨
const tintColorDark = "#fff";

export const Colors = {
  light: {
    primary: "#3288FF", // 👈 이 녀석이 추가되어야 에러가 사라집니다!
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    border: "#ddd",
    inputBackground: "#f9f9f9",
  },
  dark: {
    primary: "#3288FF", // 다크모드용
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#333",
    inputBackground: "#222",
  },
};

// ... Fonts 부분은 그대로 두셔도 됩니다.
