## 업무관리 협업 툴 서비스
<img src="https://github.com/CuteSeeun/Web-TeamToast/blob/main/cover.png" alt="홈 화면 예시" width="400" />

- 배포 링크 : https://team-toast-fe.vercel.app


## 프로젝트 소개
"누구나 쉽게 사용할 수 있는 업무 관리 협업 서비스"를 주제로 한 웹 기반 플랫폼입니다. 

팀 구성원들이 독립적인 협업 공간을 생성하여 팀 목표에 따라 스프린트와 이슈를 체계적으로 관리할 수 있는 서비스를 제공하고자 하였습니다. 
또한, 검색, 드래그 앤 드롭, 차트 그래프를 통해 스프린트와 이슈를 검색/수정하며 직관적으로 확인할 수 있는 기능과 팀원 간 실시간 소통을 위한 채팅 기능을 구현하였습니다.

<details>
  <summary>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="7" width="13" height="10" rx="2" ry="2"></rect>
  <polygon points="16 7 22 11 22 13 16 17 16 7"></polygon>
</svg>
    TeamToast.mp4  :  이미지 클릭 → 영상 시청 
  </summary>

  [![유튜브 미리보기 이미지](https://img.youtube.com/vi/4sR4FVVXjDQ/0.jpg)](https://www.youtube.com/watch?v=4sR4FVVXjDQ)
</details>


## 배포 및 리팩토링 기간
- 2025.01.14 ~ 2025.01.31  

## 이전 버전 (리팩토링 전)
https://github.com/CuteSeeun/Web-TeamToast  

## 개발 환경
- **Front-end** : React, TypeScript, Recoil, Styled-components
- **Back-end** : Node.js, Express.js
- **Database** : MySQL
- **배포**  
  프론트 : Vercel  
  백엔드 : AWS  
  CI/CD : Github Actions  


## 데이터베이스 설계
- **DB 엔진** : MySQL 8.0
- **주요 테이블**
<img src="https://github.com/CuteSeeun/Web-TeamToast/blob/main/table.png" alt="홈 화면 예시" width="900" />

## 페이지별 주요 기능
**개발 인원** : [최세은](https://github.com/CuteSeeun)  
- **로그인/회원가입** : coolSMS 사용해 인증코드 발송, JWT 토큰 사용
- **기본 CRUD** : 스페이스, 프로젝트, 스프린트, 이슈, 댓글, 채팅 채널, 팀원 생성/수정/삭제
- **결제** : 10명 이상 시 구독 결제 → 토스 연동
- **권한** : 권한에 따른 팀원 초대, 플랜 결제, 스페이스명과 팀원 권한 수정
- **칸반보드** : react-dnd 라이브러리 사용, 드래그 앤 드랍 기능
- **대시보드** : chart.js 라이브러리 사용, 다양한 그래프 기능
- **간트차트** : gantt-task-react 라이브러리 사용, 타임라인 기능
- **채팅** : socket.io 라이브러리 사용, 실시간 채팅 기능
