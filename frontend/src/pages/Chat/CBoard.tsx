import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatContainer from './ChatContainer';
import TapMenu from './TapMenu';
import { connectSocket, disconnectSocket, onMessage, sendMessage, Message } from '../../socketClient';
import { HashLoader } from 'react-spinners';
import { requestNotificationPermission, showNotification } from '../../socketClient';

const BoardContainer = styled.div`
  position: relative; /* 스프린트 완료 버튼 위치를 위한 설정 */
  display: flex;
  flex-direction: row;
  /* border-right: 1px solid #ddd; */
  padding-left: 15px; /* 사이드 메뉴와 간격 조정 */
  /* padding-right: 15px; */
  overflow: hidden; 
  width:1400px;
  /* background:pink; */
  flex-shrink:0;
  /* height: 600px; */
`;

const CBoard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  // const receivedMessageIds = new Set(); // 메시지 ID를 추적

  // 2초 후 로딩 상태 종료 (추가)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, []);

  // //프로젝트 헤더에 작성할 코드 : 소켓 연결, 알림 허용용
  // useEffect(() => {
  //   // 알림 권한 요청
  //   requestNotificationPermission();
  //   // 컴포넌트가 마운트될 때 소켓 연결
  //   connectSocket();

  //   onMessage((message: Message) => {
  //     setMessages((prev) => [...prev, message]);

  //     // **알림 표시**
  //     showNotification(
  //       `새 메시지 - ${message.user}`,
  //       message.content,
  //       '/chat-icon.png'
  //     );
  //   });

  //   // 컴포넌트가 언마운트될 때 소켓 연결 해제
  //   return () => {
  //     disconnectSocket();
  //   };
  // }, []); // 빈 의존성 배열로 처음 렌더링될 때 한 번만 실행

  // 로딩 상태에 따른 조건부 렌더링
  if (loading) {
    return (
      <BoardContainer style={{ display: 'flex',alignItems: 'center' ,marginLeft:'532px' }}>
        <HashLoader color="#36d7b7" />
      </BoardContainer>
    );
  }

  return (
    <BoardContainer>
      <TapMenu />
      <ChatContainer />
    </BoardContainer>
  );
};

export default CBoard;

