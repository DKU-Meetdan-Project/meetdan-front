// 파일: utils/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "user-token";

// ✅ 토큰 가져오기 (이 함수가 없어서 에러가 났던 겁니다)
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

// ✅ 로그인 시 토큰 저장
export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error("토큰 저장 실패", e);
  }
};

// ✅ 로그아웃 시 토큰 삭제
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error("토큰 삭제 실패", e);
  }
};

// (테스트용) 가짜 로그인 함수
export const login = async (email: string) => {
  // 실제 서버 통신 대신 무조건 성공 처리
  if (email.includes("dankook.ac.kr")) {
    const fakeToken = "abc-123-fake-token";
    await saveToken(fakeToken);
    return true;
  }
  return false;
};
