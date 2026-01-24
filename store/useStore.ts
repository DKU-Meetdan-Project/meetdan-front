// store/useStore.ts
import { create } from "zustand";

// ✅ Team 인터페이스 완전체 정의
export interface Team {
  id: number;
  title: string;
  campus: "죽전" | "천안";
  dept: string;
  gender: "M" | "F";
  status: "RECRUITING" | "ACTIVE" | "FULL"; // 👈 에러 났던 범인 (추가됨)
  content: string;
  count: number;
  currentCount: number;
  age: number;
  tags: string[];
  members: { name: string; role: string }[];
}

interface AppState {
  posts: Team[];
  myTeams: Team[];
  setPosts: (posts: Team[]) => void;
  addPost: (post: Team) => void;
  joinTeam: (team: Team) => void;
}

export const useStore = create<AppState>((set) => ({
  // ✅ 초기 데이터도 필드 다 채워줌
  posts: [
    {
      id: 1,
      title: "디자인과 여신팟",
      campus: "죽전",
      dept: "시각디자인",
      gender: "F",
      status: "RECRUITING",
      content: "매너 좋은 분들 구해요~",
      count: 4,
      currentCount: 2,
      age: 22,
      tags: ["#술찌", "#맛집탐방"],
      members: [{ name: "김민지", role: "LEADER" }],
    },
    {
      id: 2,
      title: "체대 훈남들",
      campus: "천안",
      dept: "생활체육",
      gender: "M",
      status: "FULL",
      content: "재밌게 노실 분!",
      count: 4,
      currentCount: 4,
      age: 24,
      tags: ["#에너자이저", "#주량무제한"],
      members: [{ name: "박철수", role: "LEADER" }],
    },
  ],
  myTeams: [],

  setPosts: (newPosts) => set({ posts: newPosts }),
  addPost: (newPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
  joinTeam: (newTeam) =>
    set((state) => ({ myTeams: [newTeam, ...state.myTeams] })),
}));
