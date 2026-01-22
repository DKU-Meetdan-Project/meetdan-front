// 파일 경로: app/api/client.ts (폴더 없으면 만드세요!)
type ApiResponse = {
  code: number;
  message?: string; // message는 있을 수도 있고 없을 수도 있음 (?)
  data?: any;
};

// 1. 진짜 API 주소 (나중에 백엔드가 알려주면 여기만 수정!)
const BASE_URL = "http://localhost:8080/api";

// api/client.ts

// 1. 가짜 딜레이 함수 (서버 통신 흉내)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const API = {
  // ✅ [인증] 이메일 인증번호 요청 (단국대 메일만 허용)
  requestEmailAuth: async (email: string) => {
    console.log(`[Mock] 인증 메일 발송: ${email}`);
    await delay(1000);

    if (!email.endsWith("@dankook.ac.kr")) {
      return {
        code: 400,
        message: "학교 이메일(@dankook.ac.kr)만 가능합니다.",
      };
    }
    return { code: 200, message: "인증번호가 발송되었습니다. (테스트: 1234)" };
  },

  // ✅ [인증] 인증번호 확인
  verifyEmailCode: async (email: string, code: string) => {
    console.log(`[Mock] 인증번호 확인: ${code}`);
    await delay(800);

    if (code === "1234") {
      return { code: 200, message: "인증 성공!" };
    }
    return { code: 400, message: "인증번호가 틀렸습니다." };
  },

  // ✅ [로그인/회원가입]
  login: async (email: string): Promise<ApiResponse> => {
    console.log(`[Mock] 로그인 시도: ${email}`);
    await delay(1000);

    // 성공 시 가짜 토큰 발급
    return {
      code: 200,
      data: {
        accessToken: "fake-jwt-token-dankook-student",
        user: {
          message: "로그인 성공!",
          id: 1,
          nickname: "코딩하는 곰",
          dept: "소프트웨어학과",
          gender: "M", // 성별 (M/F)
          campus: "죽전", // 캠퍼스 (죽전/천안)
        },
      },
    };
  },

  // ✅ [내 정보] 토큰으로 내 정보 가져오기 (성별/캠퍼스 포함)
  getMe: async () => {
    await delay(500);
    return {
      code: 200,
      data: {
        id: 1,
        nickname: "코딩하는 곰",
        dept: "소프트웨어학과",
        gender: "M",
        campus: "죽전",
      },
    };
  },

  // ... (기존 createTeam 등은 필요하면 유지)
};
