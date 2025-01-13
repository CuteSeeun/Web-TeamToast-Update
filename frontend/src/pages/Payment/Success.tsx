import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api";
import { UpgradeSuccessWrap } from "./priceStyle";

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // URL에서 필요한 파라미터 가져오기
  const customerKey = searchParams.get("customerKey");
  const authKey = searchParams.get("authKey");
  const amount = searchParams.get("amount");
  const orderName = searchParams.get("orderName");
  const orderId = searchParams.get("orderId");
  const subscriptionId = searchParams.get("subscriptionId");
  const spaceId = sessionStorage.getItem("sid");
  const additionalMembers = searchParams.get("additionalMembers"); // 추가 인원 정보

  console.log("spaceId:", spaceId);

  const handleSubscriptionUpdate = useCallback(
    async (
      customerKey: string,
      authKey: string,
      amount: string,
      orderName: string,
      orderId: string,
      subscriptionId: string,
      additionalMembers: string
    ) => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        if (!spaceId) {
          throw new Error(
            "spaceId가 null입니다. 세션 스토리지를 확인해주세요."
          );
        }

        // 결제 정보 서버로 전송
        const billingResponse = await axiosInstance.post(
          "/billing/complete",
          {
            customerKey,
            authKey,
            amount: parseInt(amount),
            orderName,
            orderId,
            subscriptionId: parseInt(subscriptionId),
          }
        );
        console.log("Billing 성공:", billingResponse.data);

        // 요금제 변경 API 호출
        const upgradeResponse = await axiosInstance.post(
          "/subscription/change-to-paid",
          {
            spaceId: parseInt(spaceId),
            userEmail: customerKey,
            additionalMembers: parseInt(additionalMembers),
          }
        );
        console.log("요금제 업그레이드 성공:", upgradeResponse.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            "서버 요청 실패:",
            error.response?.data || error.message
          );
          setErrorMessage("서버 요청 중 문제가 발생했습니다.");
        } else {
          console.error("예기치 않은 오류 발생:", error);
          setErrorMessage("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [spaceId] // 이곳에 의존성 추가
  );

  useEffect(() => {
    console.log("customerKey:", customerKey);
    console.log("authKey:", authKey);
    console.log("amount:", amount);
    console.log("orderName:", orderName);
    console.log("orderId:", orderId);
    console.log("subscriptionId:", subscriptionId);
    console.log("additionalMembers:", additionalMembers);
    if (
      customerKey &&
      authKey &&
      amount &&
      orderName &&
      orderId &&
      subscriptionId &&
      additionalMembers
    ) {
      handleSubscriptionUpdate(
        customerKey,
        authKey,
        amount,
        orderName,
        orderId,
        subscriptionId,
        additionalMembers
      );
    } else {
      setErrorMessage("결제 정보가 누락되었습니다.");
    }
  }, [
    customerKey,
    authKey,
    amount,
    orderName,
    orderId,
    subscriptionId,
    additionalMembers,
    handleSubscriptionUpdate, // 의존성 배열에 추가
  ]);

  // 팀 초대 화면으로 이동
  const navigateToTeamWithInvite = () => {
    navigate("/team", { state: { openInviteModal: true } });
  };

  return (
    <UpgradeSuccessWrap>
      <h1>🎉구독 업그레이드가 성공적으로 완료되었습니다! 🎉</h1>
      {isLoading ? (
        <p>결제 처리 중입니다...</p>
      ) : errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <>
          <p>새로운 팀원을 초대하고 더 많은 협업을 시작하세요.</p>
          <button onClick={navigateToTeamWithInvite}>팀원 초대하기</button>
        </>
      )}
    </UpgradeSuccessWrap>
  );
};

export default Success;
