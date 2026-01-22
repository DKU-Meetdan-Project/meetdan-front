// utils/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const TOKEN_KEY = "user_auth_token";

export const AuthService = {
  // 1. 로그인 성공 시 토큰 저장 & 메인 이동
  login: async (token: string) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log("🔑 토큰 저장 완료");
      router.replace("/(tabs)");
    } catch (e) {
      console.error("토큰 저장 실패", e);
    }
  },

  // 2. 로그아웃 (토큰 삭제 & 로그인화면 이동)
  logout: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.log("🔒 로그아웃");
      router.replace("/login");
    } catch (e) {
      console.error("로그아웃 실패", e);
    }
  },

  // 3. 토큰 가져오기 (API 호출 때 사용)
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },
};
