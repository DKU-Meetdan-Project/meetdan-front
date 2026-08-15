// 파일: store/useStore.ts
import { create } from "zustand";

// 1. Team 인터페이스
export interface Team {
  id: number;
  title: string;
  campus: "죽전" | "천안";
  dept: string;
  gender: "M" | "F";
  /** MATCHED = 매칭이 성사된 팀. 더 이상 게시판에 노출되지 않고 신청도 받지 않는다. */
  status: "RECRUITING" | "ACTIVE" | "FULL" | "READY" | "MATCHED";
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
/** 양 팀이 합의한 만남 약속. 채팅방에서 직접 입력받는다(자동 감지 아님). */
export interface ConfirmedPlan {
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:mm" (24시간) */
  time: string;
  /** 자유 텍스트. 예: "죽전역 근처" */
  place: string;
}

export interface Match {
  id: string;
  myTeamId: number;
  partnerTeamId: number;
  partnerTeamName: string;
  startedAt: string;
  /** 선택 사항. 없어도 채팅·매칭은 그대로 굴러간다. */
  confirmedPlan?: ConfirmedPlan;
}

/**
 * 매칭 신청 결과. 실패 사유마다 안내 문구가 달라야 해서 boolean 대신 객체로 돌려준다.
 */
export type SendRequestResult =
  | { ok: true }
  | { ok: false; message: string };

// 3. 신청서 데이터 (보낸 것, 받은 것 공통 사용)
export interface RequestData {
  id: number;
  senderTeamId: number; // 보낸 팀 ID
  receiverTeamId: number; // 받는 팀 ID
  status: "WAITING" | "ACCEPTED" | "REJECTED";
  timestamp: string;
}

// 4. 신고 / 차단
export type ReportReason = "ABUSE" | "SEXUAL" | "SPAM" | "FRAUD" | "NO_SHOW" | "ETC";

/** 신고 대상. 사람 한 명일 수도 있고, 채팅방 전체일 수도 있다. */
export type ReportTargetType = "USER" | "ROOM";

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
  reason: ReportReason;
  detail: string;
  /** 어느 채팅방에서 신고했는지 (운영자가 대화를 열어볼 수 있게) */
  roomId?: string;
  createdAt: string;
}

export interface BlockedUser {
  id: string;
  name: string;
  dept?: string;
  /** 어느 방에서 차단했는지 (차단 목록에서 맥락을 보여주려고) */
  roomId?: string;
  blockedAt: string;
}

// 5. 로그인한 나 자신
/**
 * 로그인/재시작 시 서버(현재는 mock)에서 받아오는 내 정보.
 * 회원가입 입력값이 화면 곳곳(프로필, 팀 생성)에서 쓰이도록 여기 한 곳에 둔다.
 */
export interface CurrentUser {
  id: number;
  nickname: string;
  dept: string;
  gender: "M" | "F";
  campus: "죽전" | "천안";
}

interface AppState {
  currentUser: CurrentUser | null;
  posts: Team[];
  myTeams: Team[];
  /**
   * 매칭이 성사되어 게시판에서 내려간 팀들.
   * 활동 내역·채팅방에서 상대 팀 이름과 학과를 계속 찾을 수 있게 보관한다.
   */
  matchedTeams: Team[];
  sentRequests: RequestData[]; // ✅ [수정] 타입 통일
  receivedRequests: RequestData[];
  matches: Match[];
  reports: Report[];
  blockedUsers: BlockedUser[];

  setCurrentUser: (user: CurrentUser) => void;
  /** 로그아웃 시 호출. 다음 계정에 이전 유저 정보가 새지 않게 한다. */
  clearCurrentUser: () => void;

  setPosts: (posts: Team[]) => void;
  addPost: (post: Team) => void;
  joinTeam: (team: Team) => void;
  deleteTeam: (id: number) => void;
  toggleTeamStatus: (id: number, isPublic: boolean) => void;
  simulateJoinMember: (id: number) => void;
  /**
   * 초대 코드로 실제 팀에 합류. 코드가 없거나, 이미 속한 팀이거나,
   * 정원이 찼거나, 매칭이 끝난 팀이면 false.
   */
  joinTeamByCode: (code: string) => boolean;
  updateTeam: (id: number, updates: Partial<Team>) => void;

  sendMatchRequest: (
    myTeamId: number,
    targetTeamId: number,
  ) => SendRequestResult;
  /** 신청 수락. 매칭을 만들고, 두 팀 사이의 대기중 신청을 ACCEPTED로 바꾼다. */
  acceptMatch: (myTeamId: number, partnerTeamId: number) => string;
  /** 신청 거절. 받은 신청 하나를 REJECTED로 바꾼다. */
  rejectMatchRequest: (requestId: number) => void;

  /**
   * 약속 확정/수정. 채팅방 id로 매칭 기록을 못 찾으면(예전 경로로 들어온 방)
   * fallbackName으로 최소한의 기록을 만들어 둔다. 그래야 활동 탭에서도 보인다.
   */
  setConfirmedPlan: (
    matchId: string,
    plan: ConfirmedPlan,
    fallbackName?: string,
  ) => void;
  clearConfirmedPlan: (matchId: string) => void;

  /** 신고 접수. 같은 대상을 중복 신고하면 false를 돌려준다. */
  submitReport: (report: Omit<Report, "id" | "createdAt">) => boolean;
  blockUser: (user: Omit<BlockedUser, "blockedAt">) => void;
  unblockUser: (userId: string) => void;
  isBlocked: (userId: string) => boolean;
}

const formatDate = (d = new Date()) =>
  `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;

/**
 * 채팅방 id = 매칭 id. 어느 쪽이 수락하든 같은 방이 나와야 하므로
 * 두 팀 id를 정렬해서 만든다.
 */
export const buildMatchId = (teamA: number, teamB: number) => {
  const [lo, hi] = [teamA, teamB].sort((a, b) => a - b);
  return `match_${lo}_${hi}`;
};

/** 신청서가 이 두 팀 사이의 것인가 (보낸/받은 방향 무관) */
const isBetween = (req: RequestData, teamA: number, teamB: number) =>
  (req.senderTeamId === teamA && req.receiverTeamId === teamB) ||
  (req.senderTeamId === teamB && req.receiverTeamId === teamA);

export const useStore = create<AppState>((set, get) => ({
  // 0. 로그인 전에는 비어있음. 로그인 또는 앱 재시작 복원 시 채워진다.
  currentUser: null,

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
      inviteCode: "DSGN01", // 초대 코드 합류를 개발 중에 시험해볼 수 있게
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

  matchedTeams: [],
  matches: [],
  reports: [],
  blockedUsers: [],

  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null }),

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
    const normalized = code.trim().toUpperCase();
    if (!normalized) return false;

    const state = get();
    const hasCode = (t: Team) => t.inviteCode?.toUpperCase() === normalized;
    // 공개된 팀이든 비공개 팀이든 코드만 맞으면 들어갈 수 있다
    const target =
      state.posts.find(hasCode) ?? state.myTeams.find(hasCode) ?? null;

    if (!target) return false;
    if (state.myTeams.some((t) => t.id === target.id)) return false; // 이미 속한 팀
    if (target.status === "MATCHED") return false; // 매칭이 끝난 팀
    if (target.currentCount >= target.count) return false; // 정원 초과

    const me = state.currentUser;
    const nextCount = target.currentCount + 1;
    const joined: Team = {
      ...target,
      currentCount: nextCount,
      members: [
        ...target.members,
        { name: me?.nickname ?? "나", role: "MEMBER" },
      ],
      // 인원이 다 차면 준비완료로 (simulateJoinMember와 동일한 규칙)
      status: nextCount === target.count ? "READY" : target.status,
    };

    set((s) => ({
      myTeams: [joined, ...s.myTeams],
      // 게시판에 올라와 있던 팀이면 인원 현황도 같이 갱신한다
      posts: s.posts.map((p) => (p.id === joined.id ? joined : p)),
    }));
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

    if (!myTeam || !targetTeam) {
      return { ok: false, message: "팀 정보를 찾을 수 없어요." };
    }

    // 이미 매칭이 끝난 팀은 더 이상 신청을 주고받지 않는다
    if (targetTeam.status === "MATCHED") {
      return {
        ok: false,
        message: "이미 매칭이 성사된 팀이에요. 다른 팀을 찾아보세요.",
      };
    }
    if (myTeam.status === "MATCHED") {
      return {
        ok: false,
        message: "이미 매칭이 성사된 팀으로는 신청할 수 없어요.",
      };
    }

    // 같은 팀에 대기중인 신청이 이미 있으면 중복으로 쌓지 않는다
    const alreadySent = state.sentRequests.some(
      (r) =>
        r.senderTeamId === myTeamId &&
        r.receiverTeamId === targetTeamId &&
        r.status === "WAITING",
    );
    if (alreadySent) {
      return {
        ok: false,
        message: "이미 신청한 팀이에요. 상대방의 응답을 기다려주세요.",
      };
    }

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
    return { ok: true };
  },

  acceptMatch: (myTeamId, partnerTeamId) => {
    const matchId = buildMatchId(myTeamId, partnerTeamId);
    const state = get();
    const partner =
      state.posts.find((p) => p.id === partnerTeamId) ||
      state.myTeams.find((t) => t.id === partnerTeamId);
    const newMatch: Match = {
      id: matchId,
      myTeamId,
      partnerTeamId,
      partnerTeamName: partner ? partner.title : "알 수 없는 팀",
      startedAt: formatDate(),
    };

    // 이 매칭을 만들어낸 신청서를 ACCEPTED로 넘긴다. 방향(받은/보낸)은
    // 모르니 두 목록 모두에서 이 두 팀 사이의 대기중 신청을 찾는다.
    const accept = (list: RequestData[]) =>
      list.map((r) =>
        r.status === "WAITING" && isBetween(r, myTeamId, partnerTeamId)
          ? { ...r, status: "ACCEPTED" as const }
          : r,
      );

    // 매칭된 두 팀은 MATCHED로 바꾸고 게시판(posts)에서 내린다.
    const isMatchedTeam = (teamId: number) =>
      teamId === myTeamId || teamId === partnerTeamId;

    set((state) => {
      // 게시판에서 내리기 전에 두 팀을 보관해둔다 (id 중복은 한 번만)
      const archived: Team[] = [];
      for (const team of [...state.posts, ...state.myTeams]) {
        if (!isMatchedTeam(team.id)) continue;
        if (archived.some((t) => t.id === team.id)) continue;
        if (state.matchedTeams.some((t) => t.id === team.id)) continue;
        archived.push({ ...team, status: "MATCHED" });
      }

      return {
        // 이미 있는 매칭이면 중복 생성하지 않는다
        matches: state.matches.some((m) => m.id === matchId)
          ? state.matches
          : [newMatch, ...state.matches],
        receivedRequests: accept(state.receivedRequests),
        sentRequests: accept(state.sentRequests),
        myTeams: state.myTeams.map((t) =>
          isMatchedTeam(t.id) ? { ...t, status: "MATCHED" as const } : t,
        ),
        posts: state.posts.filter((p) => !isMatchedTeam(p.id)),
        matchedTeams: [...archived, ...state.matchedTeams],
      };
    });

    return matchId;
  },

  rejectMatchRequest: (requestId) =>
    set((state) => ({
      receivedRequests: state.receivedRequests.map((r) =>
        r.id === requestId ? { ...r, status: "REJECTED" as const } : r,
      ),
    })),

  setConfirmedPlan: (matchId, plan, fallbackName) =>
    set((state) => {
      const exists = state.matches.some((m) => m.id === matchId);
      if (exists) {
        return {
          matches: state.matches.map((m) =>
            m.id === matchId ? { ...m, confirmedPlan: plan } : m,
          ),
        };
      }
      const placeholder: Match = {
        id: matchId,
        myTeamId: 0,
        partnerTeamId: 0,
        partnerTeamName: fallbackName ?? "매칭된 팀",
        startedAt: formatDate(),
        confirmedPlan: plan,
      };
      return { matches: [placeholder, ...state.matches] };
    }),

  clearConfirmedPlan: (matchId) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, confirmedPlan: undefined } : m,
      ),
    })),

  // ── 신고 / 차단 ────────────────────────────────────────
  submitReport: (report) => {
    // 같은 방에서 같은 대상을 또 신고하는 건 막는다. (운영 쪽 중복 접수 방지)
    const already = get().reports.some(
      (r) =>
        r.targetType === report.targetType &&
        r.targetId === report.targetId &&
        r.roomId === report.roomId,
    );
    if (already) return false;

    const newReport: Report = {
      ...report,
      id: `report_${Date.now()}`,
      createdAt: formatDate(),
    };
    set((state) => ({ reports: [newReport, ...state.reports] }));
    return true;
  },

  blockUser: (user) =>
    set((state) => {
      if (state.blockedUsers.some((b) => b.id === user.id)) return state;
      return {
        blockedUsers: [
          { ...user, blockedAt: formatDate() },
          ...state.blockedUsers,
        ],
      };
    }),

  unblockUser: (userId) =>
    set((state) => ({
      blockedUsers: state.blockedUsers.filter((b) => b.id !== userId),
    })),

  isBlocked: (userId) => get().blockedUsers.some((b) => b.id === userId),
}));

/** 신고 사유 라벨. 시트와 차단 목록이 같은 문구를 쓰도록 한곳에 둔다. */
export const REPORT_REASONS: {
  value: ReportReason;
  label: string;
  desc: string;
}[] = [
  { value: "ABUSE", label: "욕설·비방", desc: "모욕적인 언행이나 혐오 표현" },
  { value: "SEXUAL", label: "성희롱·불쾌한 대화", desc: "성적인 농담이나 요구" },
  { value: "SPAM", label: "광고·홍보", desc: "외부 링크나 상업적 목적의 대화" },
  { value: "FRAUD", label: "사칭·사기", desc: "타인 사칭, 금전 요구" },
  { value: "NO_SHOW", label: "약속 불이행", desc: "노쇼하거나 연락이 끊김" },
  { value: "ETC", label: "기타", desc: "위에 없는 다른 문제" },
];
