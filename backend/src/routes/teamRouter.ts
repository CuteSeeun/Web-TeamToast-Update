import { Router } from "express";
import {
  getTeamMembers,
  updateRole,
  removeMember,
  getUserRole,
} from "../controller/teamListController";
import { inviteUser, getSpaceLimit } from "../controller/inviteUserController";

const router = Router();

// 팀원 초대
router.post("/invite", inviteUser);

// 초대 가능한 인원 확인
router.get("/invite/limit", getSpaceLimit);

// 팀원 목록 조회
router.get("/members", getTeamMembers);

// 팀원 역할 변경
router.put("/update-role", updateRole);

// 팀원 삭제 (DELETE 사용)
router.delete("/remove", removeMember);

// 권한 수정된거 role 다시 보내기
router.get('/user-role',getUserRole);

export default router;
