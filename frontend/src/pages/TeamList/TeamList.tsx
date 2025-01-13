import React from "react";
import * as Styled from "./teamStyle";
import axios from "axios";
import axiosInstance from "../../api";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  teamMembersState,
  currentUserRoleState,
} from "../../recoil/atoms/memberAtoms";
import { userState } from "../../recoil/atoms/userAtoms";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface TeamListProps {
  spaceId: number;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  currentUserRole: string;
  setCurrentUserRole: React.Dispatch<React.SetStateAction<string>>; // 추가
  onOpenInviteModal: () => void;
}

const PASTEL_COLORS = [
  "#ff9a9e", "#ffd280", "#aff1b6", "#81deea", "#c4b5fd",
  "#e4b8ff", "#f4b400", "#b8e986", "#89cff0", "#f8c8dc"
];

const TeamList: React.FC<TeamListProps> = ({
  spaceId,
  teamMembers,
  setTeamMembers,
  currentUserRole,
  onOpenInviteModal,
  setCurrentUserRole,
}) => {
  const currentUser = useRecoilValue(userState);
  const currentUserEmail = currentUser?.email || "";

  const getRandomColor = (index: number) => PASTEL_COLORS[index % PASTEL_COLORS.length];

  // 권한 변경 API 호출
  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      if (newRole === "top_manager") {
        const confirmChange = window.confirm(
          "다른 사람을 최고관리자로 설정하면 기존 최고관리자는 관리자로 변경됩니다. 계속하시겠습니까?"
        );
        if (!confirmChange) return;

        const currentTopManager = teamMembers.find(
          (member) => member.role === "top_manager"
        );

        // 기존 최고관리자의 역할을 "manager"로 변경
        if (currentTopManager && currentTopManager.email !== email) {
          await axiosInstance.put("/team/update-role", {
            email: currentTopManager.email,
            role: "manager",
            spaceId,
          });

          // 기존 최고관리자 역할을 업데이트
          setTeamMembers((prevMembers) =>
            prevMembers.map((member) =>
              member.email === currentTopManager.email
                ? { ...member, role: "manager" }
                : member
            )
          );

          // 세션 스토리지 업데이트
          if (currentTopManager.email === currentUserEmail) {
            sessionStorage.setItem("userRole", "manager");
          }
        }
      }

      // 새로운 최고관리자 설정
      await axiosInstance.put("/team/update-role", {
        email,
        role: newRole,
        spaceId,
      });

      // 새 역할 적용
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.email === email ? { ...member, role: newRole } : member
        )
      );

      if (email === currentUserEmail) {
        sessionStorage.setItem("userRole", newRole);
        setCurrentUserRole(newRole); // prop으로 전달받은 함수 호출
      }

      // 페이지 새로고침으로 UI 전체 리프레쉬
      alert("역할이 성공적으로 변경되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("역할 변경에 실패했습니다.");
    }
  };
  const handleDeleteMember = async (email: string) => {
    try {
      await axiosInstance.delete("/team/remove", {
        data: { email, spaceId },
      });
      const updatedMembers = teamMembers.filter(
        (member) => member.email !== email
      );
      setTeamMembers(updatedMembers);
    } catch (error) {
      console.error("Failed to delete member:", error);
      alert("멤버 삭제에 실패했습니다.");
    }
  };
  return (
    <Styled.TeamMaWrap>
      <div className="title-area">
        <h2>팀 목록</h2>
        {(currentUserRole === "top_manager" ||
          currentUserRole === "manager") && (
          <button className="add-member-btn" onClick={onOpenInviteModal}>
            <span>+ 멤버 추가</span>
          </button>
        )}
      </div>

      <div className="member-list">
        {teamMembers.map((member,idx) => (
          <div className="member-item" key={idx}>
            <div
              className="avatar"
              style={{ backgroundColor: getRandomColor(idx) }}
            >
              {member.name[0]}
            </div>
            
            <div className="info">
              <span className="name">{member.name}</span>
              <span className="email">{member.email}</span>
            </div>

            <div className="action-buttons">
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.email, e.target.value)}
                disabled={
                  currentUserRole !== "top_manager" ||
                  member.email === currentUserEmail
                }
              >
                <option value="top_manager">최고관리자</option>
                <option value="manager">관리자</option>
                <option value="normal">팀원</option>
              </select>
              <button
                className="delete-button"
                onClick={() => handleDeleteMember(member.email)}
                disabled={
                  currentUserRole == "normal" || // 최고관리자가 아닌 경우 비활성화
                  member.email === currentUserEmail || // 본인의 계정인 경우 비활성화
                  member.role === "top_manager" // 최고관리자인 경우 비활성화
                }
                title={
                  currentUserRole !== "top_manager" &&
                  currentUserRole !== "manager"
                    ? "삭제 권한이 없습니다."
                    : member.email === currentUserEmail
                    ? "본인의 계정을 삭제할 수 없습니다."
                    : member.role === "top_manager"
                    ? "최고관리자는 삭제할 수 없습니다."
                    : ""
                }
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </Styled.TeamMaWrap>
  );
};

export default TeamList;
