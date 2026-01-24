// app/store.ts

// 1. 내 팀 상태 관리 (신청 내역 sentRequests 추가됨)
/*export const myTeamState = {
  myTeams: [] as any[],
  sentRequests: [] as any[], // ✅ 에러 해결: 이 줄이 없어서 에러가 났던 겁니다!
};

// 2. 전체 게시글 데이터 (가상의 상대 팀들)
export let posts = [
  {
    id: 999,
    title: "디자인과 여신 3인방 미팅해요 🎨",
    dept: "시각디자인과",
    gender: "F",
    count: 3,
    age: 22,
    tags: ["#금손", "#전시회", "#분위기"],
    status: "ACTIVE",
    createdAt: "방금 전",
    content: "재미있게 놀 분들 구합니다! 저희 술 잘 못 마셔요 ㅎㅎ",
  },
  {
    id: 888,
    title: "체육학과 남자 4명 ⚽️",
    dept: "체육교육과",
    gender: "M",
    count: 4,
    age: 23,
    tags: ["#운동", "#활발", "#술고래"],
    status: "ACTIVE",
    createdAt: "10분 전",
    content: "안주 킬러 사절. 술 게임 좋아하시는 분들 환영합니다.",
  },
];

// 3. 팀 추가 함수
export const addTeam = (team: any) => {
  myTeamState.myTeams.unshift(team);
};

// 4. 팀 정보 수정 함수
export const updateTeam = (id: number, newData: any) => {
  const index = myTeamState.myTeams.findIndex((t) => t.id === id);
  if (index > -1) {
    myTeamState.myTeams[index] = { ...myTeamState.myTeams[index], ...newData };
  }
};

// 5. ✅ [추가] 팀 삭제 함수 (에러 해결)
export const deleteTeam = (id: number) => {
  myTeamState.myTeams = myTeamState.myTeams.filter((t) => t.id !== id);
  // 게시판에서도 삭제
  posts = posts.filter((p) => p.id !== id);
};

// 6. 상태 변경 (공개/비공개)
export const toggleTeamStatus = (id: number, isPublic: boolean) => {
  const team = myTeamState.myTeams.find((t) => t.id === id);
  if (team) {
    team.status = isPublic ? "ACTIVE" : "READY";
    // 게시판(posts) 연동 로직
    if (isPublic) {
      // 이미 있는지 확인 후 없으면 추가
      if (!posts.find((p) => p.id === id)) {
        posts.unshift({ ...team, createdAt: "방금 전" });
      }
    } else {
      // 비공개면 게시판에서 제거
      posts = posts.filter((p) => p.id !== id);
    }
  }
};

// 7. (테스트용) 멤버 입장 시뮬레이션
export const simulateJoinMember = (teamId: number) => {
  const team = myTeamState.myTeams.find((t) => t.id === teamId);
  if (team && team.currentCount < team.count) {
    team.currentCount += 1;
    // 인원 다 차면 자동으로 READY 상태로 변경
    if (team.currentCount === team.count) {
      team.status = "READY";
    }
  }
};

// 8. ✅ [추가] 초대 코드로 팀 참가하기
export const joinTeamByCode = (code: string) => {
  if (!code) return false;

  // 가상의 친구 팀 생성
  const friendTeam = {
    id: Date.now(),
    title: `친구의 팀 (${code})`,
    content: "야 빨리 들어와!",
    dept: "경영학과",
    gender: "M",
    count: 4,
    currentCount: 2,
    age: 24,
    inviteCode: code,
    members: [
      { name: "친구(팀장)", role: "LEADER" },
      { name: "나", role: "MEMBER" },
    ],
    tags: ["#초대받음", "#가보자고"],
    status: "RECRUITING", // 인원이 다 안 찼으므로
  };

  myTeamState.myTeams = [friendTeam, ...myTeamState.myTeams];
  return true;
};

// 9. ✅ [수정] 매칭 신청 (신청 내역 저장 기능 포함)
export const sendMatchRequest = (myTeamId: number, targetTeamId: number) => {
  const myTeam = myTeamState.myTeams.find((t) => t.id === myTeamId);
  const targetTeam = posts.find((p) => p.id === targetTeamId);

  if (!myTeam || !targetTeam) return false;

  // 신청 내역 저장 (sentRequests에 추가)
  myTeamState.sentRequests.unshift({
    id: Date.now(),
    myTeamTitle: myTeam.title,
    targetTeamTitle: targetTeam.title,
    targetDept: targetTeam.dept,
    status: "WAITING",
    sentAt: new Date().toLocaleDateString(),
  });

  return true;
};
*/
