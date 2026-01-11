// 파일 경로: app/api/client.ts (폴더 없으면 만드세요!)

// 1. 진짜 API 주소 (나중에 백엔드가 알려주면 여기만 수정!)
const BASE_URL = "http://localhost:8080/api";

export const API = {
  // [추가됨] 팀 생성하기
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

  // 로그인 (아까 만든 거)
  login: async (studentId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            accessToken: "fake-jwt",
            user: { name: "이재우", dept: "소프트웨어" },
          },
        });
      }, 500);
    });
  },

  // 내 정보 조회 (아까 만든 거)
  getMe: async () => {
    return {
      code: 200,
      data: { nickname: "코딩하는 곰", dept: "소프트웨어학과" },
    };
  },
};
