// 파일: store/useStore.ts
import { create } from "zustand";

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

interface AppState {
  posts: Team[];
  myTeams: Team[];
  sentRequests: any[]; // 신청 내역 저장소

  setPosts: (posts: Team[]) => void;
  addPost: (post: Team) => void;
  joinTeam: (team: Team) => void;
  deleteTeam: (id: number) => void;
  toggleTeamStatus: (id: number, isPublic: boolean) => void;
  simulateJoinMember: (id: number) => void;
  joinTeamByCode: (code: string) => boolean;
  updateTeam: (id: number, updates: Partial<Team>) => void;

  // ✅ [추가됨] 매칭 신청 함수
  sendMatchRequest: (myTeamId: number, targetTeamId: number) => boolean;
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
      members: [{ name: "김민지", role: "LEADER" }],
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
  ],
  myTeams: [],
  sentRequests: [],

  // 2. 액션들
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
      const newStatus = isPublic ? "ACTIVE" : "READY";
      return {
        myTeams: state.myTeams.map((t) =>
          t.id === id ? { ...t, status: newStatus } : t,
        ),
        posts: state.posts.map((p) =>
          p.id === id ? { ...p, status: newStatus } : p,
        ),
      };
    }),

  simulateJoinMember: (id) =>
    set((state) => ({
      myTeams: state.myTeams.map((t) => {
        if (t.id === id && t.currentCount < t.count) {
          const newCount = t.currentCount + 1;
          return {
            ...t,
            currentCount: newCount,
            status: newCount === t.count ? "READY" : t.status,
          };
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

  // ✅ [구현] 매칭 신청
  sendMatchRequest: (myTeamId, targetTeamId) => {
    const state = get();
    const myTeam = state.myTeams.find((t) => t.id === myTeamId);
    const targetTeam = state.posts.find((p) => p.id === targetTeamId);

    if (!myTeam || !targetTeam) return false;

    set((state) => ({
      sentRequests: [
        {
          id: Date.now(),
          myTeamTitle: myTeam.title,
          targetTeamTitle: targetTeam.title,
          targetDept: targetTeam.dept,
          status: "WAITING",
          sentAt: new Date().toLocaleDateString(),
        },
        ...state.sentRequests,
      ],
    }));
    return true;
  },
}));
