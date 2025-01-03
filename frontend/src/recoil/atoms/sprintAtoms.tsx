// sprintAtoms
import { atom, selector } from 'recoil';

// 스프린트 상태 ENUM 타입 정의
export type SprintStatus = 'disabled' | 'enabled' | 'end';

export interface Sprint {
    spid: number;
    spname: string;
    status: SprintStatus;
    goal: string;
    enddate: string;
    startdate: string;
    project_id: number;
}

interface Filter {
    manager: string;
    status: string;
    priority: string;
    type: string;
}

export const sprintState = atom<Sprint[]>({
    key: 'sprintState',
    default: []
});

export const filterState = atom<Filter>({
    key: 'filterState',
    default: { manager: '', status: '', priority: '', type: '' }
});

export const sortedSprintsState = selector<Sprint[]>({
    key: 'sortedSprintsState',
    get: ({ get }) => {
        const sprints = get(sprintState);
        return sprints.slice().sort((a, b) => {
            if (a.status === 'enabled' && b.status !== 'enabled') return -1;
            if (a.status !== 'enabled' && b.status === 'enabled') return 1;
            return 0;
        });
    }
});

// enabled 상태의 스프린트만 가져오는 셀렉터
export const enabledSprintsState = selector<Sprint[]>({
    key: 'enabledSprintsState',
    get: ({ get }) => {
        const sprints = get(sprintState); // 모든 스프린트를 가져옴
        return sprints.filter((sprint) => sprint.status === 'enabled'); // enabled 상태만 필터링
    },
});

//모든 스프린트의 제목, 날짜를 가져오는 셀렉터
export const sprintBasicInfoState = selector<{ spname: string; startdate: string; enddate: string }[]>({
    key: 'sprintBasicInfoState',
    get: ({ get }) => {
      const sprints = get(sprintState); // 모든 스프린트를 가져옴
      return sprints.map((sprint) => ({
        spname: sprint.spname,
        startdate: sprint.startdate,
        enddate: sprint.enddate,
      }));
    },
  });
