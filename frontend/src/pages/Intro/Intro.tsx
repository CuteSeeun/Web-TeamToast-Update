import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/userAtoms';
import { Link, useNavigate } from 'react-router-dom';
import { AnimateWaveText, IntroWrap } from './introStyle';
import SpaceView from './SpaceView';
import TabSection from './TabSection';
import IntroFooter from './IntroFooter';

const Intro = () => {

    const user = useRecoilValue(userState);
    const [space , setSpace] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false); // 페이드아웃 상태
    const navigate = useNavigate();

    const [tabVisible , setTabvisible] = useState(false); // 애니메이션
    const tabRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTabvisible(true); // 요소가 보이면 애니메이션 상태 변경
            } else {
              setTabvisible(false); // 사라질 때
            }
          });
        },
        { threshold: 0.5 } // 50% 이상 보이면 실행
      );
  
      if (tabRef.current) {
        observer.observe(tabRef.current);
      }
  
      return () => {
        if (tabRef.current) observer.unobserve(tabRef.current);
      };
    }, []);


    const openSpaceModal = () => {
        if (user) {
          setIsFadingOut(true); // 비디오 페이드아웃 시작
          setTimeout(() => {
            setSpace(true); // 비디오가 사라진 후 SpaceView를 표시
            setIsFadingOut(false); // 초기화
          }, 500); // 애니메이션 지속 시간과 맞춤
        } else {
          navigate('/join');
        }
      };

      const closeSpaceModal = () =>{
        setSpace(false);
    };



    return (
        <IntroWrap>
             <div className="intro-container">
                <div className="text-section">
                    <h1 className="main-title">
                        일이 술술 풀리는 협업툴<br />
                        <AnimateWaveText>
                            {"TeamToast".split("").map((char,index)=>(
                                <span key={index} className='wave' style={{animationDelay:`${index * 0.3}s`}}>
                                    {char}
                                </span>
                            ))}
                        </AnimateWaveText>
                    </h1>
                    <p className="sub-title">
                        원활한 소통과 매끄러운 업무 흐름을 가장 쉬운 협업 공간,<br/>TeamToast에서 경험해 보세요.
                    </p>
                    <div className="button-group">
                        {user ? (
                            <>
                                 <button className="secondary-button" onClick={openSpaceModal}>
                            시작하기
                        </button>
                            </>
                        ):(
                            <>
                             <button className="secondary-button" onClick={openSpaceModal}>
                            회원가입
                        </button>
                            </>
                        )
                    }
                       
                    </div>
                </div>
                <div className="visual-section">
                {space ? (
            <div className="modal-overlay fade-in">
              <SpaceView onClose={closeSpaceModal} />
            </div>
          ) : (
            <video
              className={`intro-video ${isFadingOut ? "fade-out" : ""}`}
              src="/intro.mp4"
              autoPlay
              muted
              loop
            />
          )}
                </div>
            </div>

            {/* 새로운 탭 섹션 추가 */}
            <div  ref={tabRef} className={`tab-section ${tabVisible ? 'animate-fade-in' : 'animate-fade-out'}`}>
                <TabSection />
            </div>

          <IntroFooter/>
        </IntroWrap>

    );
};

export default Intro;