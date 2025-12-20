// 파일 경로: app/store.ts

// 1. 전체 게시글 리스트 (홈 화면에 뜰 데이터)
export let posts = [
  {
    id: '1',
    title: '소프트웨어학과 남자 3명! 술 진탕 마실 분 구함 🍻',
    dept: '소프트웨어학과',
    gender: 'M',
    count: 3,
    avgAge: 23,
    tags: ['#술잘마심', '#재밌음', '#칼답'],
    timestamp: '방금 전',
    content: '기본 데이터입니다.',
    status: 'ACTIVE' // 이미 등록된 글
  },
  {
    id: '2',
    title: '디자인과 22학번 3명 미팅해요~ 🌸',
    dept: '시각디자인과',
    gender: 'F',
    count: 3,
    avgAge: 22,
    tags: ['#분위기파', '#맛집투어', '#비흡연'],
    timestamp: '10분 전',
    content: '기본 데이터입니다.',
    status: 'ACTIVE'
  },
];

// 2. 내 팀 관리 (방금 만든 방 정보를 저장하는 곳)
export const myTeamState = {
  currentTeam: null as any // 처음엔 팀 없음
};

// 3. 내 팀 생성하기 (write.tsx에서 사용)
export const setMyTeam = (team: any) => {
  // 방을 만들면 초기 멤버는 '나' 혼자
  myTeamState.currentTeam = {
      ...team,
      inviteCode: 'NEW-8282', // 랜덤 코드 생성 시뮬레이션
      members: [{ name: '나(팀장)', status: 'READY' }] 
  };
  console.log('내 팀 생성됨(대기중):', myTeamState.currentTeam);
};

// 4. 게시글 정식 등록 (ACTIVE로 변경 후 전체 리스트에 추가)
// 나중에 'my_team.tsx'에서 "팀 등록하기" 버튼 누를 때 사용
export const updatePostStatus = (id: string, status: string) => {
  // 내 팀이 존재하면 상태 변경
  if (myTeamState.currentTeam && myTeamState.currentTeam.id === id) {
      myTeamState.currentTeam.status = status;
      
      // 상태가 ACTIVE가 되면 전체 리스트(posts)에도 추가해서 남들에게 보이게 함
      if (status === 'ACTIVE') {
          posts = [myTeamState.currentTeam, ...posts];
          console.log('전체 리스트에 글 등록됨!');
      }
  }
};

export const places = [
  {
    id: '1',
    name: '단국포차 죽전점',
    desc: '안주가 맛있는 헌팅포차 1위',
    image: 'https://avatar.iran.liara.run/username?username=DanPocha&background=ff0000', 
    tags: ['#단체석완비', '#헌팅가능', '#새벽5시까지'],
    benefit: '3:3 방문 시 소주 1병 서비스 🍶',
    distance: '정문 3분',
    phone: '031-262-0000', // 📞 추가됨
    bestMenu: ['🔥 직화 오돌뼈 & 주먹밥', '🥘 나가사키 짬뽕탕', '🧀 콘치즈 폭탄'], // 🥘 추가됨
  },
  {
    id: '2',
    name: '별밤 감성주점',
    desc: '분위기 좋은 룸술집',
    image: 'https://avatar.iran.liara.run/username?username=StarNight&background=0000ff',
    tags: ['#룸술집', '#조용함', '#안주맛집'],
    benefit: '메인 안주 주문 시 감자튀김 무료 🍟',
    distance: '단대프라자 2층',
    phone: '031-8005-0000',
    bestMenu: ['🍗 순살 치킨 가라아게', '🍟 버터갈릭 감자튀김', '🍉 화채 빙수'],
  },
  {
    id: '3',
    name: '역전할머니맥주',
    desc: '살얼음 맥주로 어색함 타파!',
    image: 'https://avatar.iran.liara.run/username?username=Beer&background=Tk',
    tags: ['#가성비', '#시원함', '#2차추천'],
    benefit: '테이블당 쥐포튀김 서비스 🐟',
    distance: '도보 5분',
    phone: '031-123-4567',
    bestMenu: ['🍺 살얼음 생맥주', '🦑 버터구이 오징어', '🍜 치즈 라볶이'],
  },
]; 