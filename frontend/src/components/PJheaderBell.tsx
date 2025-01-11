import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GoBell } from "react-icons/go";
import { NotificationCard, NotificationsPopup } from '../styles/HeaderStyle';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { notificationsAtom } from '../recoil/atoms/notificationsAtom';
import { userState } from '../recoil/atoms/userAtoms';
import axiosInstance from '../api';


const PJheaderBell = () => {
  const [notifications, setNotifications] = useRecoilState(notificationsAtom); // 알림 데이터
    const user = useRecoilValue(userState);
    const [popOpen , setPopOpen] = useState(false);
    const [loading , setLoading] = useState(false);

    // console.log(notifications);
    const navigate = useNavigate();
    

    useEffect(()=>{
      const fetchNotification = async()=>{

        if (!user?.email) {
          console.warn("유효한 사용자 이메일이 없습니다.");
          return;
        }

        try {
          const response = await axiosInstance.get('alarm/notifications',{
            params:{userEmail : user?.email},
          });
          setNotifications(response.data);
        } catch (error) {
          console.error('알림 데이터를 가져오지 못했습니다.',error);
        }
      };
      if(user?.email){
        fetchNotification();
      }
    },[user?.email , setNotifications]);

      // 알림 클릭 시 읽음 처리 및 세션 저장
      const notificationClick =async(issueId:number,projectId:number)=>{

        console.log("Issue ID:", issueId);
        console.log("Project ID:", projectId); 


        if (!projectId) {
          console.error("Project ID is undefined!");
          return;
        }

        try {
          // 서버에 알림 읽음 상태 업데이트
          await axiosInstance.post('alarm/markAsRead',{issueId});
          //읽은 알림 삭제
          setNotifications((prev)=>prev.filter((n)=>n.issue_id !== issueId));
          sessionStorage.setItem('pid',projectId.toString());

          //페이지 이동
          navigate(`/issue/${issueId}`);
        } catch (error) {
          console.error("알림 읽음 처리 실패:", error);
        }
      }

    return (
        <div
        style={{ position: 'relative' }}
        onMouseEnter={()=>setPopOpen(true)} // 팝업 열림
        onMouseLeave={()=>setPopOpen(false)} // 팝업 닫힘
      >
        {/* 알림 아이콘 */}
        <div className="notification-icon">
          <GoBell className="icon-wrap" style={{cursor:'pointer'}}/>
          {notifications.length > 0 && (
            <span className="notification-badge"></span> // 알림 배지
          )}
        </div>
      {/* 알림 팝업 */}
      {popOpen && (
        <NotificationsPopup>
          {/* <span className='read'>전체읽음</span> */}
          {loading ? (
            <div className="loading-message">로딩 중...</div> // 로딩 메시지
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard key={notification.issue_id}
              onClick={async() => {await notificationClick(notification.issue_id ,notification.project_id)
              setPopOpen(false);
              }}>
               
                <div className="notification-header">
                    {notification.projectTitle}
                  </div>
                  <div className="notification-body">
                    {notification.issueTitle}
                  </div>
                  <div className="notification-body">
                    {notification.issueDetail}
                  </div>
                {/* </Link> */}
              </NotificationCard>
            ))
          ) : (
            <div className="empty-message">새로운 알림이 없습니다.</div>
          )}
        </NotificationsPopup>
      )}
    </div>
    );
};

export default PJheaderBell;