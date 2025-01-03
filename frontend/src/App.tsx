import Payment from "./pages/Payment/Payment";
import Success from "./pages/Payment/Success";
import Fail from "./pages/Payment/Fail";
import CardChangeSuccess from "./pages/Payment/CardChangeSuccess";
import CardChangeFail from "./pages/Payment/CardChangeFail";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import ActiveSprint from './pages/ActiveSprint/ActiveSprint';
import Backlog from './pages/Backlog/Backlog';
import Chat from './pages/Chat/Chat';
import Dashboard from './pages/Dashboard/Dashboard';
import IssueDetail from './pages/IssueDetail/IssueDetail';
import IssueList from './pages/IssueList/IssueList';
import Layout from './components/Layout';
import Intro from './pages/Intro/Intro';
import Login from './pages/Login/Login';
import Join from './pages/Join/Join';
import RatePlan from './pages/Intro/RatePlan';
import SpaceAll from './pages/SpaceList/Space';
import ProjectList from './pages/ProjectList/ProjectList';
import OAuthCallback from './pages/Login/KakaoLogin';
import TeamManagement from "./pages/TeamList/TeamManagement";
import SidebarLayout from './components/SidebarLayout'; // 추가
import SpaceManagement from './pages/SpaceManagement/SpaceManagement';
import Profile from './pages/Profile/Profile';
import Plan from './pages/Plan/Plan';
import { useAuth } from './hooks/useAuth';
import { RiTimeLine } from "react-icons/ri";
import Timeline from "./pages/TimeLine/TimeLine";
import PassFind from "./pages/Login/PassFind";

const App: React.FC = () => {
//   const loading = useAuth();
// if(loading){
//   return <div>스피너 추가할랭</div>;
// }

useAuth();

 

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Intro />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/join" element={<Join />} />
            <Route path="/pass" element={<PassFind />} />
            <Route path="/rate" element={<RatePlan />} />
            <Route path="/space" element={<SpaceAll />} />
            <Route path="/projectlist/:sid" element={<ProjectList />} />
            <Route path="/oauth" element={<OAuthCallback />} />
            <Route path="/team" element={<TeamManagement />} />
            {/* SidebarLayout을 사용하는 라우트 */}
            <Route element={<SidebarLayout />}>
              <Route path="/activesprint/:pid" element={<ActiveSprint />} />
              <Route path="/backlog/:pid" element={<Backlog />} />
              <Route path="/chat/:sid" element={<Chat />} />
              <Route path="/dashboard/:pid" element={<Dashboard />} />
              <Route path="/issuelist/:pid" element={<IssueList />} />
              <Route path="/issue/:isid" element={<IssueDetail />} />
              <Route path="/timeline/:pid" element={<Timeline/>} />
            </Route>
            <Route path="/payment" element={<Payment />} />
            <Route path="/spacemanagement" element={<SpaceManagement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/card-change-success" element={<CardChangeSuccess />} />
            <Route path="/card-change-fail" element={<CardChangeFail />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fail" element={<Fail />} />
          </Route>

        </Routes>
      </Router>
    </>
  );
};

export default App;
