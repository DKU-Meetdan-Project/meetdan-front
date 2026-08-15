// 파일 경로: app/api/client.ts (폴더 없으면 만드세요!)
import type { CurrentUser } from "@/store/useStore";
import * as AuthService from "@/utils/auth";

type ApiResponse = {
  code: number;
  message?: string; // message는 있을 수도 있고 없을 수도 있음 (?)
  data?: any;
};

// 1. 가짜 딜레이 함수 (서버 통신 흉내)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ⏸️ [백엔드 연동 전] 이메일 인증은 아직 서버가 없어서 목(mock)으로 동작합니다.
// 실제 API가 나오면 아래 두 함수의 내용만 fetch 호출로 갈아끼우면 됩니다.
const MOCK_EMAIL_CODE = "123456"; // 개발용 고정 인증번호
type SignupPayload = {
  name: string;
  gender: "M" | "F" | null;
  campus: string;
  dept: string;
};

// 회원가입 최종 제출용. 비밀번호는 서버에서만 다루므로 기기에 남기지 않는다.
type SignupRequest = {
  name: string;
  gender: "M" | "F";
  campus: string;
  dept: string;
  email: string;
  userId: string;
};

// 아직 가입 정보가 없을 때 쓰는 기본값 (개발 편의용)
const FALLBACK_USER: CurrentUser = {
  id: 1,
  nickname: "코딩하는 곰",
  dept: "소프트웨어학과",
  gender: "M",
  campus: "죽전",
};

/**
 * 서버 대신 기기에 저장된 가입 정보로 내 정보를 만들어 줍니다.
 * 실제 API가 붙으면 이 함수는 사라지고 서버 응답을 그대로 쓰면 됩니다.
 */
const buildMockUser = async (): Promise<CurrentUser> => {
  const account = await AuthService.getAccount();
  if (!account) return FALLBACK_USER;

  return {
    id: 1,
    nickname: account.name,
    dept: account.dept,
    gender: account.gender,
    campus: account.campus as CurrentUser["campus"],
  };
};

export const API = {
  // 🧪 [Mock] 이메일 인증번호 발송
  requestEmailAuth: async (
    email: string,
    payload: SignupPayload,
  ): Promise<ApiResponse> => {
    console.log(`[Mock] 인증번호 발송: ${email}`, payload);
    await delay(800);

    return {
      code: 200,
      message: `[개발용] 인증번호는 ${MOCK_EMAIL_CODE} 입니다.`,
    };
  },

  // 🧪 [Mock] 인증번호 확인
  verifyEmailCode: async (
    email: string,
    code: string,
  ): Promise<ApiResponse> => {
    console.log(`[Mock] 인증번호 확인: ${email} / ${code}`);
    await delay(600);

    if (code !== MOCK_EMAIL_CODE) {
      return { code: 400, message: "인증번호가 일치하지 않습니다." };
    }
    return { code: 200, message: "인증이 완료되었습니다." };
  },

  // 🧪 [Mock] 회원가입
  // 실제 서버가 붙으면 payload를 그대로 POST하고 응답 토큰만 받아 쓰면 됩니다.
  signup: async (payload: SignupRequest): Promise<ApiResponse> => {
    console.log(`[Mock] 회원가입 시도: ${payload.userId}`, payload);
    await delay(1000);

    return {
      code: 200,
      message: "회원가입이 완료되었습니다.",
      data: {
        accessToken: "fake-jwt-token-dankook-student",
        user: {
          id: 1,
          userId: payload.userId,
          nickname: payload.name,
          name: payload.name,
          dept: payload.dept,
          gender: payload.gender,
          campus: payload.campus as CurrentUser["campus"],
          email: payload.email,
        },
      },
    };
  },

  // ✅ [로그인]
  // 비밀번호는 서버 검증용으로만 전달하고, 어디에도 저장하지 않습니다.
  login: async (id: string, password: string): Promise<ApiResponse> => {
    console.log(`[Mock] 로그인 시도: ${id} (pw ${password.length}자)`);
    await delay(1000);

    if (!id || !password) {
      return { code: 400, message: "아이디와 비밀번호를 입력해주세요." };
    }

    // 성공 시 가짜 토큰 + 내 정보(가입 때 입력한 값) 발급
    const user = await buildMockUser();
    return {
      code: 200,
      data: {
        accessToken: "fake-jwt-token-dankook-student",
        user: {
          message: "로그인 성공!",
          userId: id,
          ...user,
        },
      },
    };
  },

  // ✅ [내 정보] 토큰으로 내 정보 가져오기 (성별/캠퍼스 포함)
  getMe: async (): Promise<ApiResponse> => {
    await delay(500);
    return {
      code: 200,
      data: await buildMockUser(),
    };
  },

  // ... (기존 createTeam 등은 필요하면 유지)
};
