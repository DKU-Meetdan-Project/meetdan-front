// 파일 경로: app/store.ts

// 1. 전체 게시글 리스트 (홈 화면에 뜰 데이터)
export const posts = [
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
          posts.unshift(myTeamState.currentTeam);
          console.log('전체 리스트에 글 등록됨!');
      }
  }
};