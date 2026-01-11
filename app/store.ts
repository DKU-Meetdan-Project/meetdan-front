// app/store.ts

// 1. 내 팀들 (이제 배열로 관리!)
export const myTeamState = {
  myTeams: [] as any[],
};

// 2. 전체 게시글 (공개된 팀만 여기로 들어옴)
export let posts = [
  {
    id: 999, // 겹치지 않게 큰 숫자로
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
];

// ✅ [추가] 매칭 신청 함수 (공격!)
export const sendMatchRequest = (myTeamId: number, targetTeamId: number) => {
  const myTeam = myTeamState.myTeams.find((t) => t.id === myTeamId);
  const targetTeam = posts.find((p) => p.id === targetTeamId);

  if (!myTeam || !targetTeam) return false;

  console.log(
    `🚀 [매칭 신청] 우리팀(${myTeam.title}) -> 상대팀(${targetTeam.title})`
  );
  return true;
};

// 3. ✅ [핵심] 팀 생성 (방 만들기)
export const addTeam = (teamData: any) => {
  const newTeam = {
    id: Date.now(), // 고유 ID
    ...teamData,
    // 방 만들면 바로 초대 코드 발급
    inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    members: [{ name: "나(팀장)", role: "LEADER" }], // 나 혼자 입장
    currentCount: 1, // 현재 1명
    status: "RECRUITING", // 상태: 모집중 (인원 다 차야 공개 가능)
  };

  // 내 팀 목록에 추가
  myTeamState.myTeams = [newTeam, ...myTeamState.myTeams];
  console.log(
    `✅ 방 생성됨! 코드: ${newTeam.inviteCode} (현재 1/${newTeam.count})`
  );
};

// 4. (테스트용) 팀원 입장 시뮬레이션
export const simulateJoinMember = (teamId: number) => {
  const team = myTeamState.myTeams.find((t) => t.id === teamId);
  if (team && team.currentCount < team.count) {
    team.currentCount++;
    team.members.push({ name: `친구${team.currentCount}`, role: "MEMBER" });

    // 인원이 꽉 찼으면 -> 'READY(준비완료)'로 변경
    if (team.currentCount === team.count) {
      team.status = "READY";
      console.log("🎉 팀원 모집 완료! 이제 게시판에 올릴 수 있습니다.");
    }
  }
};

// 5. 공개/비공개 토글 (인원이 꽉 찼을 때만 가능)
export const toggleTeamStatus = (teamId: number, toActive: boolean) => {
  const team = myTeamState.myTeams.find((t) => t.id === teamId);
  if (!team) return;

  if (toActive) {
    // 공개 전환: 전체 리스트(posts)에 추가
    team.status = "ACTIVE";
    const exists = posts.find((p) => p.id === team.id);
    if (!exists) posts.unshift(team);
  } else {
    // 비공개 전환: 전체 리스트에서 제거
    team.status = "READY"; // 다시 준비 상태로
    posts = posts.filter((p) => p.id !== team.id);
  }
};
export const places = [
  {
    id: "1",
    name: "단국포차 죽전점",
    desc: "안주가 맛있는 헌팅포차 1위",
    image:
      "https://avatar.iran.liara.run/username?username=DanPocha&background=ff0000",
    tags: ["#단체석완비", "#헌팅가능", "#새벽5시까지"],
    benefit: "3:3 방문 시 소주 1병 서비스 🍶",
    distance: "정문 3분",
    phone: "031-262-0000", // 📞 추가됨
    bestMenu: [
      "🔥 직화 오돌뼈 & 주먹밥",
      "🥘 나가사키 짬뽕탕",
      "🧀 콘치즈 폭탄",
    ], // 🥘 추가됨
  },
  {
    id: "2",
    name: "별밤 감성주점",
    desc: "분위기 좋은 룸술집",
    image:
      "https://avatar.iran.liara.run/username?username=StarNight&background=0000ff",
    tags: ["#룸술집", "#조용함", "#안주맛집"],
    benefit: "메인 안주 주문 시 감자튀김 무료 🍟",
    distance: "단대프라자 2층",
    phone: "031-8005-0000",
    bestMenu: ["🍗 순살 치킨 가라아게", "🍟 버터갈릭 감자튀김", "🍉 화채 빙수"],
  },
  {
    id: "3",
    name: "역전할머니맥주",
    desc: "살얼음 맥주로 어색함 타파!",
    image: "https://avatar.iran.liara.run/username?username=Beer&background=Tk",
    tags: ["#가성비", "#시원함", "#2차추천"],
    benefit: "테이블당 쥐포튀김 서비스 🐟",
    distance: "도보 5분",
    phone: "031-123-4567",
    bestMenu: ["🍺 살얼음 생맥주", "🦑 버터구이 오징어", "🍜 치즈 라볶이"],
  },
];
