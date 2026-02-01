// 파일: store/useStore.ts
import { create } from "zustand";

// 1. Team 인터페이스
export interface Team {
  id: number;
  title: string;
  campus: "죽전" | "천안";
  dept: string;
  gender: "M" | "F";
  status: "RECRUITING" | "ACTIVE" | "FULL" | "READY";
  content: string;
  count: number;
  currentCount: number;
  age: number;
  timestamp: string;
  tags: string[];
  members: { name: string; role: string }[];
  inviteCode?: string;
}

// 2. 매칭 정보 인터페이스
export interface Match {
  id: string;
  myTeamId: number;
  partnerTeamId: number;
  partnerTeamName: string;
  startedAt: string;
}

// 3. 신청서 데이터 (보낸 것, 받은 것 공통 사용)
export interface RequestData {
  id: number;
  senderTeamId: number; // 보낸 팀 ID
  receiverTeamId: number; // 받는 팀 ID
  status: "WAITING" | "ACCEPTED" | "REJECTED";
  timestamp: string;
}

interface AppState {
  posts: Team[];
  myTeams: Team[];
  sentRequests: RequestData[]; // ✅ [수정] 타입 통일
  receivedRequests: RequestData[];
  matches: Match[];

  setPosts: (posts: Team[]) => void;
  addPost: (post: Team) => void;
  joinTeam: (team: Team) => void;
  deleteTeam: (id: number) => void;
  toggleTeamStatus: (id: number, isPublic: boolean) => void;
  simulateJoinMember: (id: number) => void;
  joinTeamByCode: (code: string) => boolean;
  updateTeam: (id: number, updates: Partial<Team>) => void;

  sendMatchRequest: (myTeamId: number, targetTeamId: number) => boolean;
  acceptMatch: (myTeamId: number, partnerTeamId: number) => string;
}

export const useStore = create<AppState>((set, get) => ({
  // 1. 초기 데이터
  posts: [
    {
      id: 1,
      title: "디자인과 여신팟",
      campus: "죽전",
      dept: "시각디자인",
      gender: "F",
      status: "ACTIVE",
      content: "매너 좋은 분들 구해요~",
      count: 4,
      currentCount: 2,
      age: 22,
      timestamp: "방금 전",
      tags: ["#술찌", "#맛집탐방"],
      members: [{ name: "배수지", role: "LEADER" }],
    },
    {
      id: 2,
      title: "체대 훈남들",
      campus: "천안",
      dept: "생활체육",
      gender: "M",
      status: "ACTIVE",
      content: "재밌게 노실 분!",
      count: 4,
      currentCount: 4,
      age: 24,
      timestamp: "10분 전",
      tags: ["#에너자이저", "#주량무제한"],
      members: [{ name: "박철수", role: "LEADER" }],
    },
    {
      id: 300,
      title: "소웨 코딩 기계들",
      campus: "죽전",
      dept: "소프트웨어학과",
      gender: "M",
      status: "ACTIVE",
      content: "알고리즘 잘 푸는 여자분 구합니다.",
      count: 3,
      currentCount: 3,
      age: 23,
      timestamp: "30분 전",
      tags: ["#너드남", "#안경씀", "#체크남방"],
      members: [{ name: "고경수", role: "LEADER" }],
    },
  ],

  myTeams: [
    {
      id: 100,
      title: "경영학과 존잘러",
      campus: "죽전",
      dept: "경영학과",
      gender: "M",
      status: "ACTIVE",
      content: "우리가 짱임",
      count: 3,
      currentCount: 3,
      age: 24,
      timestamp: "어제",
      tags: ["#재밌음"],
      members: [{ name: "나(팀장)", role: "LEADER" }],
      inviteCode: "TEST01",
    },
  ],

  // ✅ [추가] 보낸 신청 Mock Data (내가 디자인과에 신청함)
  sentRequests: [
    {
      id: 888,
      senderTeamId: 100, // 내 팀
      receiverTeamId: 1, // 디자인과 팀
      status: "WAITING",
      timestamp: "1시간 전",
    },
  ],

  receivedRequests: [
    {
      id: 999,
      senderTeamId: 300,
      receiverTeamId: 100,
      status: "WAITING",
      timestamp: "방금 도착",
    },
  ],

  matches: [],

  // ... (기존 액션들 동일) ...
  setPosts: (newPosts) => set({ posts: newPosts }),
  addPost: (newPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
  joinTeam: (newTeam) =>
    set((state) => ({ myTeams: [newTeam, ...state.myTeams] })),
  deleteTeam: (id) =>
    set((state) => ({
      myTeams: state.myTeams.filter((t) => t.id !== id),
      posts: state.posts.filter((p) => p.id !== id),
    })),
  toggleTeamStatus: (id, isPublic) =>
    set((state) => {
      const newStatus: Team["status"] = isPublic ? "ACTIVE" : "READY";
      const updatedMyTeams = state.myTeams.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t,
      );
      const targetTeam = updatedMyTeams.find((t) => t.id === id);
      let updatedPosts = [...state.posts];
      if (isPublic && targetTeam) {
        const exists = updatedPosts.find((p) => p.id === id);
        if (exists) {
          updatedPosts = updatedPosts.map((p) =>
            p.id === id ? { ...p, status: "ACTIVE" as const } : p,
          );
        } else {
          updatedPosts = [targetTeam, ...updatedPosts];
        }
      } else {
        updatedPosts = updatedPosts.filter((p) => p.id !== id);
      }
      return { myTeams: updatedMyTeams, posts: updatedPosts };
    }),
  simulateJoinMember: (id) =>
    set((state) => ({
      myTeams: state.myTeams.map((t) => {
        if (t.id === id && t.currentCount < t.count) {
          const newCount = t.currentCount + 1;
          const nextStatus: Team["status"] =
            newCount === t.count ? "READY" : t.status;
          return { ...t, currentCount: newCount, status: nextStatus };
        }
        return t;
      }),
    })),
  joinTeamByCode: (code) => {
    if (!code) return false;
    const friendTeam: Team = {
      id: Date.now(),
      title: `친구의 팀 (${code})`,
      content: "야 빨리 들어와!",
      dept: "경영학과",
      gender: "M",
      campus: "죽전",
      count: 4,
      currentCount: 2,
      age: 24,
      timestamp: "방금 전",
      tags: ["#초대받음", "#가보자고"],
      members: [{ name: "친구(팀장)", role: "LEADER" }],
      status: "RECRUITING",
      inviteCode: code,
    };
    set((state) => ({ myTeams: [friendTeam, ...state.myTeams] }));
    return true;
  },
  updateTeam: (id, updates) =>
    set((state) => ({
      myTeams: state.myTeams.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      ),
      posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  // ✅ [수정] RequestData 형식에 맞춰 저장
  sendMatchRequest: (myTeamId, targetTeamId) => {
    const state = get();
    const myTeam = state.myTeams.find((t) => t.id === myTeamId);
    const targetTeam = state.posts.find((p) => p.id === targetTeamId);

    if (!myTeam || !targetTeam) return false;

    const newRequest: RequestData = {
      id: Date.now(),
      senderTeamId: myTeamId,
      receiverTeamId: targetTeamId,
      status: "WAITING",
      timestamp: "방금 전",
    };

    set((state) => ({
      sentRequests: [newRequest, ...state.sentRequests],
    }));
    return true;
  },

  acceptMatch: (myTeamId, partnerTeamId) => {
    const sortedIds = [myTeamId, partnerTeamId].sort((a, b) => a - b);
    const matchId = `match_${sortedIds[0]}_${sortedIds[1]}`;
    const state = get();
    const partner =
      state.posts.find((p) => p.id === partnerTeamId) ||
      state.myTeams.find((t) => t.id === partnerTeamId);
    const newMatch: Match = {
      id: matchId,
      myTeamId,
      partnerTeamId,
      partnerTeamName: partner ? partner.title : "알 수 없는 팀",
      startedAt: new Date().toLocaleDateString(),
    };
    const exists = state.matches.find((m) => m.id === matchId);
    if (!exists) {
      set((state) => ({ matches: [newMatch, ...state.matches] }));
    }
    return matchId;
  },
}));
