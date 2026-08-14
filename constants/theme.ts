/**
 * constants/theme.ts
 * 밋단(MeetDan) 디자인 시스템 토큰
 *
 * 토스/당근마켓 스타일의 기준:
 *  - 흰 배경을 기본으로 쓰고, 그림자 대신 1px 헤어라인으로 영역을 나눈다
 *  - 색은 아끼고, 브랜드 컬러는 "누를 수 있는 것"에만 쓴다
 *  - 한글은 자간을 살짝 좁혀야(-0.2 ~ -0.6) 단단해 보인다
 */
import { Platform, StyleSheet } from "react-native";

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

export const Palette = {
  // 브랜드 (단국대 블루)
  brand: "#3288FF",
  brandPressed: "#1E6FE0",
  brandWeak: "#EAF2FF", // 연한 브랜드 배경
  brandText: "#1B6BD6", // 연한 배경 위 텍스트용 (대비 확보)

  // 그레이 스케일
  gray900: "#191F28", // 제목
  gray800: "#333D4B",
  gray700: "#4E5968", // 본문
  gray600: "#6B7684",
  gray500: "#8B95A1", // 보조 설명
  gray400: "#B0B8C1", // 비활성
  gray300: "#D1D6DB",
  gray200: "#E5E8EB", // 테두리
  gray100: "#F2F4F6", // 채움 배경
  gray50: "#F9FAFB",
  white: "#FFFFFF",

  // 시맨틱
  red: "#F04452",
  redWeak: "#FFEBEC",
  green: "#00BF6C",
  greenWeak: "#E5F8EF",
  orange: "#FF8A00",
  orangeWeak: "#FFF3E0",
  pink: "#FF5E8F",
  pinkWeak: "#FFEDF2",
} as const;

/* ------------------------------------------------------------------ */
/* Spacing / Radius                                                    */
/* ------------------------------------------------------------------ */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  /** 화면 좌우 기본 여백 */
  screen: 20,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export const Typo = {
  /** 화면 대표 제목 */
  display: {
    fontSize: 24,
    fontWeight: "700" as const,
    letterSpacing: -0.6,
    color: Palette.gray900,
  },
  /** 헤더 제목 */
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
    color: Palette.gray900,
  },
  /** 카드/리스트 제목 */
  subtitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    letterSpacing: -0.4,
    color: Palette.gray900,
  },
  /** 섹션 라벨 */
  section: {
    fontSize: 15,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    color: Palette.gray900,
  },
  /** 본문 */
  body: {
    fontSize: 15,
    fontWeight: "500" as const,
    letterSpacing: -0.3,
    color: Palette.gray700,
  },
  /** 보조 설명 */
  caption: {
    fontSize: 13,
    fontWeight: "500" as const,
    letterSpacing: -0.2,
    color: Palette.gray500,
  },
  /** 아주 작은 라벨 (뱃지 등) */
  label: {
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
    color: Palette.gray600,
  },
} as const;

/* ------------------------------------------------------------------ */
/* Elevation                                                           */
/* ------------------------------------------------------------------ */

/** 토스처럼 그림자는 거의 안 쓴다. 떠 있어야 하는 것(탭바/모달)에만. */
export const Shadow = {
  none: {},
  soft: Platform.select({
    ios: {
      shadowColor: "#191F28",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 12,
    },
    android: { elevation: 3 },
    default: {},
  }),
  modal: Platform.select({
    ios: {
      shadowColor: "#191F28",
      shadowOpacity: 0.14,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 24,
    },
    android: { elevation: 12 },
    default: {},
  }),
} as const;

/** 1px 헤어라인 (기기 픽셀 밀도와 무관하게 얇게) */
export const Hairline = {
  height: StyleSheet.hairlineWidth,
  color: Palette.gray200,
} as const;

/* ------------------------------------------------------------------ */
/* Colors (기존 코드 호환용 시맨틱 매핑)                                 */
/* ------------------------------------------------------------------ */

const tintColorLight = Palette.brand;
const tintColorDark = Palette.white;

export const Colors = {
  light: {
    primary: Palette.brand,
    primaryPressed: Palette.brandPressed,
    primaryMuted: Palette.brandWeak,

    text: Palette.gray900,
    textSecondary: Palette.gray500,
    textBody: Palette.gray700,
    disabled: Palette.gray400,

    background: Palette.white,
    backgroundMuted: Palette.gray100,
    surface: Palette.white,

    tint: tintColorLight,
    icon: Palette.gray600,
    tabIconDefault: Palette.gray400,
    tabIconSelected: tintColorLight,

    border: Palette.gray200,
    divider: Palette.gray100,
    inputBackground: Palette.gray100,

    danger: Palette.red,
    success: Palette.green,
  },
  dark: {
    primary: "#4B96FF",
    primaryPressed: "#3288FF",
    primaryMuted: "#1B2A40",

    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    textBody: "#C4C9CE",
    disabled: "#5A6068",

    background: "#151718",
    backgroundMuted: "#1F2224",
    surface: "#1F2224",

    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#6B7280",
    tabIconSelected: tintColorDark,

    border: "#2C3033",
    divider: "#232628",
    inputBackground: "#222",

    danger: "#FF6B76",
    success: "#2ED18B",
  },
};

/* ------------------------------------------------------------------ */
/* 도메인 컬러 (캠퍼스 / 성별)                                           */
/* ------------------------------------------------------------------ */

export const CampusColor = {
  죽전: { fg: Palette.brandText, bg: Palette.brandWeak },
  천안: { fg: "#0E9F5B", bg: Palette.greenWeak },
} as const;

export const GenderColor = {
  M: { fg: Palette.brandText, bg: Palette.brandWeak, icon: "male" as const },
  F: { fg: "#E0417A", bg: Palette.pinkWeak, icon: "female" as const },
} as const;
