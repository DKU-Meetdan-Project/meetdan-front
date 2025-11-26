# 🐻 밋단 (MeetDan)

> **단국대생을 위한 3:3 과팅/미팅 매칭 서비스** > "우리 과랑 미팅할 사람?" 이제 에타 말고 밋단에서 찾자!

## 📅 프로젝트 개요
- **기간:** 2025.11 ~ (진행중)
- **팀원:** 3명 (Full-stack)
- **목표:** 단국대 재학생 인증 기반의 안전하고 간편한 팀 매칭 서비스 개발

## 🛠️ 기술 스택 (Tech Stack)
### Frontend (App)
- **Framework:** React Native (Expo SDK 52)
- **Language:** TypeScript
- **Navigation:** Expo Router (File-based routing)
- **Styling:** StyleSheet (Native)

### Backend (Server) - *Coming Soon*
- **Framework:** Spring Boot 3.x
- **Database:** MySQL, Redis
- **Infra:** AWS EC2, RDS

---

## 🚀 시작 가이드 (Getting Started)

팀원들은 이 순서대로 프로젝트를 실행해주세요.

### 1. 환경 설정
- **Node.js** (LTS 버전 권장) 설치
- **VS Code** 설치
- 휴대폰에 **[Expo Go]** 어플 설치 (App Store / Play Store)

### 2. 프로젝트 실행
```bash
# 1. 저장소 클론 (본인 터미널에서)
git clone [https://github.com/](https://github.com/)[본인아이디]/meetdan.git
cd meetdan

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npx expo start

프로그램 실행시키면 터미널에 QR코드 나올텐데 Expo GO 앱 깔고 QR인식하면 핸드폰에서 테스트 할 수 있음!

### 3. 파일 구조

meetdan/
├── app/
│   ├── (tabs)/          # 로그인 후 진입하는 메인 탭 화면들
│   │   ├── index.tsx    # 🏠 홈 (매칭 리스트)
│   │   ├── history.tsx  # 📋 신청 내역
│   │   ├── my_team.tsx  # 👥 내 팀 관리 (방 만들기)
│   │   └── profile.tsx  # 👤 마이페이지
│   ├── chat/            # 💬 채팅방 관련 화면
│   ├── team/            # ➕ 팀 생성/로비 관련 화면
│   ├── match/           # ⚔️ 매칭 신청/파티 관련 화면
│   ├── login.tsx        # 로그인 화면
│   ├── write.tsx        # 글쓰기 화면
│   ├── index.tsx        # 진입점 (Redirect 처리)
│   └── _layout.tsx      # 전체 레이아웃 (Stack 설정)
├── components/          # 재사용 컴포넌트 (버튼, 카드 등)
├── constants/           # 상수 및 공통 설정
│   └── store.ts         # 🚧 임시 가짜 DB (백엔드 연동 전까지 사용)
└── assets/              # 이미지, 폰트 등


###4 🤝 협업 규칙 (Convention)

우리 팀은 **Git Flow** 전략을 사용합니다. 복잡해 보이지만 **"조별 과제 PPT 만들기"**라고 생각하면 쉽습니다!

 1. 브랜치 전략 (Git Flow)
- **`main` 브랜치 (= 최종_제출용.ppt)**
  - **절대 직접 수정 금지!** 교수님께 제출할 완성본입니다.
  - 여기서 에러 나면 앱 전체가 먹통 됩니다.
- **`feature/...` 브랜치 (= 내_이름_초안.ppt)**
  - 작업할 때는 무조건 **내 전용 작업장**을 새로 파서 합니다.
  - 여기서 망쳐도 메인 파일은 안전합니다. 마음껏 실험하세요.
  - 예: `feature/login`, `feature/chat`

 2. 커밋 메시지 (Commit Message)
저장할 때 꼬리표를 달아주세요.
- ✨ **`feat:`** 새로운 기능 추가 (예: `feat: 로그인 버튼 구현`)
- 🐛 **`fix:`** 버그 수정 (예: `fix: 앱 꺼짐 해결`)
- 💄 **`style:`** 디자인/CSS 수정 (예: `style: 버튼 색상 변경`)
- ♻️ **`refactor:`** 코드 정리 (기능 변경 없음)

---

### 📚 실전! 작업 순서 가이드 (따라하세요)

#### 1단계: 내 작업장 만들기
작업 시작 전, 무조건 **최신 코드를 받고** 내 브랜치를 만듭니다.
```bash
git checkout main            # 1. 메인으로 이동
git pull origin main         # 2. 친구들 코드 받아오기 (필수!)
git checkout -b feature/기능명  # 3. 내 브랜치 만들고 이동 (예: feature/login)
