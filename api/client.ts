// 파일 경로: app/api/client.ts (폴더 없으면 만드세요!)
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
