// 파일: utils/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "user-token";
const ACCOUNT_KEY = "user-account";
const PROFILE_KEY = "user-profile";

// ✅ 토큰 가져오기
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

export interface Account {
  id: string;
  password: string;
  name: string;
  gender: "M" | "F";
  campus: string; // "죽전" | "천안"
  dept: string;
  email: string;
}

// ✅ 회원가입 시 입력한 계정 정보 저장
export const saveAccount = async (account: Account) => {
  try {
    await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  } catch (e) {
    console.error("계정 정보 저장 실패", e);
  }
};

// ✅ 로그인 시 저장된 계정 정보 확인
export const getAccount = async (): Promise<Account | null> => {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

/**
 * 회원가입 정보(Account)와 달리, 마이페이지에서 언제든 바꿀 수 있는 값들.
 * 이름·성별·캠퍼스·학과·이메일은 인증에 쓰이므로 여기에 두지 않는다.
 */
export interface UserProfile {
  /** 앱에서 보여줄 별명 (미설정 시 실명 사용) */
  nickname: string;
  /** 한 줄 소개 */
  bio: string;
  /** MBTI. 선택하지 않았으면 빈 문자열 */
  mbti: string;
  /** assets/images/profile_avatars 인덱스 */
  avatarIdx: number;
}

export const DEFAULT_PROFILE: UserProfile = {
  nickname: "",
  bio: "",
  mbti: "",
  avatarIdx: 0,
};

// ✅ 수정 가능한 프로필 정보 불러오기 (없으면 기본값)
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    // 나중에 필드가 늘어나도 저장된 값이 깨지지 않도록 기본값 위에 덮어쓴다
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch (e) {
    return DEFAULT_PROFILE;
  }
};

// ✅ 수정 가능한 프로필 정보 저장
export const saveProfile = async (profile: UserProfile) => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("프로필 저장 실패", e);
  }
};
