# 🧠 AI Agent Chat App

AI Agent와 WebSocket을 통해 실시간 채팅하며, 대화 및 할 일을 PostgreSQL에 저장/조회할 수 있는 웹 애플리케이션입니다.

---

## 🔧 주요 기능

-   🤖 **AI 에이전트 채팅**: WebSocket 기반 실시간 채팅
-   🧑‍💻 **유저-에이전트 메시지 분리 표시**
-   💬 **채팅 입력창 제어**: 유저의 응답 후에만 입력 가능
-   🧭 **룸 전환 기능**: Room 1 / Room 2 간 대화방 전환
-   📜 **이전 대화 불러오기**: 저장된 대화 불러오기 및 토글로 표시
-   ✅ **To-Do 리스트 저장**: 사용자의 작업 요청을 DB에 저장 가능
-   🗄️ **PostgreSQL 기반 백엔드 저장소**

---

# 📁 프로젝트 구조 및 역할 정리

## 프론트엔드

📦 src  
┣ 📂assets  
┃ ┗ 📜react.svg → 리액트 로고 이미지 등 정적 자산  
┣ 📂components → 재사용 가능한 UI 컴포넌트들  
┃ ┣ 📂chat → 채팅 관련 기능 컴포넌트 모음  
┃ ┃ ┣ 📜Chat.tsx → 채팅 전체 화면 구성 및 룸 관리  
┃ ┃ ┣ 📜ChatInput.tsx → 채팅 입력창 컴포넌트  
┃ ┃ ┣ 📜ChatMessage.tsx → 실시간 채팅 메시지 렌더링  
┃ ┃ ┣ 📜ChatMessageHistory.tsx → DB에서 불러온 과거 메시지 렌더링  
┃ ┃ ┣ 📜ChatMessages.tsx → 현재 메시지 + 히스토리 메시지 통합 표시  
┃ ┃ ┣ 📜ChatStatus.tsx → 연결 상태 및 에러 메시지 표시  
┃ ┃ ┗ 📜MarkdownComponents.tsx → 마크다운 메시지 렌더링 관련 설정  
┃ ┣ 📜Landing.tsx → 랜딩 페이지 UI 구성  
┃ ┗ 📜LandingPageWrapper.tsx → 랜딩 페이지 감싸는 래퍼 컴포넌트  
┣ 📂provider → 공통 상태 관리, WebSocket 등 외부 연동  
┃ ┣ 📜AgenticaRpcProvider.tsx → 채팅 메시지 송수신 및 상태 관리 로직  
┃ ┗ 📜AgenticaRpcProvider_types.tsx → Provider 관련 타입 정의  
┣ 📜App.tsx → 전체 앱 라우팅 및 기본 레이아웃 설정  
┣ 📜index.css → 전체 스타일시트  
┣ 📜main.tsx → 앱 진입점, ReactDOM 렌더링  
┗ 📜vite-env.d.ts → Vite 환경 관련 타입 선언

---

## 백엔드

📦 src  
┗ 📜server.ts → Express 서버 DB에 저장 및 API 라우팅 (예: /message/:roomid)

---

## 에이전트 (AI 서비스 기능 모듈)

📦 src  
┣ 📜SGlobal.ts → 에이전트 서비스 설정 및 공유 변수  
┣ 📜index.ts → 에이전트 서비스 진입점  
┣ 📜todo_service.ts → 할 일 관련 에이전트 서비스  
┗ 📜todo_types.ts → 할 일 서비스 관련 타입 정의

---

## ⚙️ 사용 기술

| 기술                   | 설명                    |
| ---------------------- | ----------------------- |
| **React + TypeScript** | UI 구성 및 상태 관리    |
| **WebSocket**          | AI Agent와 실시간 연결  |
| **Express + Node.js**  | 백엔드 서버 API         |
| **PostgreSQL**         | 대화 내역 및 To-Do 저장 |
| **Tailwind CSS**       | 빠른 스타일링           |
| **Highlight.js**       | 코드 스타일 하이라이팅  |
| **prisma**             | DB저장 orm              |

---

## 🧩 백엔드 API 목록 (Express + PostgreSQL 기반)

### 메시지 관련

| 메서드 | 엔드포인트         | 설명                         |
| ------ | ------------------ | ---------------------------- |
| `POST` | `/message`         | 채팅 메시지 저장 (사용자/AI) |
| `GET`  | `/message/:roomid` | 특정 룸의 메시지 목록 조회   |

### To-Do 리스트 관련

| 메서드   | 엔드포인트                      | 설명                        |
| -------- | ------------------------------- | --------------------------- |
| `POST`   | `/todos`                        | 새로운 할 일 생성           |
| `GET`    | `/todos`                        | 전체 To-Do 목록 조회        |
| `GET`    | `/todos/:Uid`                   | 특정 UID의 To-Do 조회       |
| `GET`    | `/todos/filter?date=YYYY-MM-DD` | 특정 날짜 이전의 To-Do 조회 |
| `GET`    | `/todos/report`                 | 미완료 To-Do 목록 조회      |
| `PATCH`  | `/todos/:Uid/toggle`            | 완료 여부 토글              |
| `DELETE` | `/todos/:Uid`                   | 특정 UID의 To-Do 삭제       |
| `DELETE` | `/alltodos`                     | 모든 To-Do 삭제             |

---

## 🧪 PostgreSQL 테이블 구조 예시

### messagelist

```sql
CREATE TABLE messagelist (
    id SERIAL PRIMARY KEY,
    users TEXT,
    roomid INTEGER,
    type TEXT,
    role TEXT,
    text TEXT
);
```

### todolist

```sql
CREATE TABLE todolist (
    Uid UUID PRIMARY KEY,
    name TEXT,
    content TEXT,
    goal TEXT, -- 날짜 문자열 (YYYY-MM-DD)
    completed BOOLEAN
);
```

---

## 📦 설치 및 실행

### 1. 프론트엔드 실행

```bash
npm install
npm run run start
```

### 2. 백엔드 실행

```bash
cd server
npm install
npm run build
npm run start
```

### 3. 에이전트 실행

```bash
cd server
npm install
npm run build
npm run start
```

### 4. PostgreSQL 설정

`.env` 파일에 다음과 같은 형식으로 PostgreSQL 연결 정보를 작성:

```
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
```

---

## 📌 향후 개선 사항

-   사용자 인증 기능 추가 (JWT 등)

---

## 📝 라이선스

본 프로젝트는 [MIT License](LICENSE)를 따릅니다.
