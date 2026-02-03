// 파일 경로: app/api/client.ts

// 1. 진짜 API 주소 (나중에 백엔드가 알려주면 여기만 수정!)
const BASE_URL = "http://localhost:8080/api";

// 2. 가짜 딜레이 함수 (로딩 흉내)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const API = {
  // ✅ [팀 생성]
  createTeam: async (data: any) => {
    console.log(`[Mock] 팀 생성 요청 데이터:`, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: "팀 생성 성공!",
          data: {
            teamId: Date.now(), // 가짜 ID 발급
            ...data,
          },
        });
      }, 1000); // 1초 뒤 성공
    });
  },

  // ✅ [로그인]
  login: async (studentId: string) => {
    console.log(`[Mock] 로그인 시도: ${studentId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            accessToken: "fake-jwt-token-example",
            user: { name: "이재우", dept: "소프트웨어학과" },
          },
        });
      }, 500);
    });
  },

  // ✅ [회원가입] (새로 추가할 위치! 📍)
  signup: async (userData: any) => {
    console.log(`[Mock] 회원가입 요청:`, userData);
    await delay(1500); // 1.5초 정도 걸리는 척

    // 간단한 중복 검사 흉내 (예: id가 'admin'이면 실패)
    if (userData.id === "admin") {
      return { code: 400, message: "이미 사용 중인 아이디입니다." };
    }

    return { code: 200, message: "회원가입 성공" };
  },

  // ✅ [내 정보 조회]
  getMe: async () => {
    return {
      code: 200,
      data: { nickname: "코딩하는 곰", dept: "소프트웨어학과" },
    };
  },
};