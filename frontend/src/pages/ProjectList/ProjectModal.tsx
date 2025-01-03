// 2024-11-26 한채경 수정, 11-28 마지막 수정
// ProjectModal.tsx

import React, { useEffect, useState } from 'react';
import { ProjectModalWrap } from './ProjectStyle';

interface ProjectModalProps {
    type: 'create' | 'edit' | 'delete';
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (pname: string, description: string) => void;
    onDelete?: () => void;
    projectData?: {
        pname: string;
        description: string;
    };
    existingNames?: string[];
}

const ProjectModal = (props: ProjectModalProps): JSX.Element | null  => {
    // React.ReactNode는 JSX.Element, null, undefined, boolean  등
    // 모든 반환 타입을 허용합니다.
    // 단순히 JSX만 반환하면 JSX.Element
    // null도 반환할 수 있으면 JSX.Element | null
    // 더 유연한 타입이 필요하면 React.ReactNode

    const [projectName, setProjectName] = useState<string>('');
    const [projectDescription, setProjectDescription] = useState<string>('');

    useEffect(() => {        
        if (props.projectData && (props.type === 'edit')) {
            setProjectName(props.projectData.pname);
            setProjectDescription(props.projectData.description);
        } else {
            setProjectName('');
            setProjectDescription('');
        }
    }, [props.projectData, props.type]);

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        console.log(`projectData: ${props.projectData}`);
        
        if (props.existingNames?.includes(projectName) && props.type === 'create') {
            alert('이미 존재하는 프로젝트 이름입니다.');
            return;
        };
        // 부모 컴포넌트로 데이터 전달
        props.onSubmit(projectName, projectDescription);

        // 인풋 필드
        setProjectName('');
        setProjectDescription('');
    };

    if (!props.isOpen) return null;

    if (props.type === 'delete') {
        // user role 확인, 관리자가 아니라면 alert 띄우고 return
        // 혹은 삼항연산자 사용해서 return 안에 오류 모달 띄우기
        return (
            <ProjectModalWrap>
                <div className="modal">
                    <h3>프로젝트 삭제</h3>
                    <p>프로젝트를 정말 삭제하시겠습니까? 프로젝트 안의 모든 데이터가 지워질 수 있습니다.</p>
                    <div className="button-group">
                        <button onClick={props.onClose}>취소</button>
                        <button onClick={props.onDelete} className="delete">삭제</button>
                    </div>
                </div>
            </ProjectModalWrap>
        );
    }

    return (
        <ProjectModalWrap>
              <div className="modal">
                <h3>{props.type === 'create' ? '프로젝트 생성' : '프로젝트 수정'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>프로젝트 이름</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                            placeholder="프로젝트 이름을 입력해 주세요."
                        />
                    </div>
                    <div className="input-group">
                        <label>프로젝트 설명</label>
                        <input
                            type="text"
                            value={projectDescription}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectDescription(e.target.value)}
                            placeholder="프로젝트 설명을 입력해 주세요."
                        />
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={props.onClose}>취소</button>
                        <button type="submit">{props.type === 'create' ? '생성' : '수정'}</button>
                    </div>
                </form>
            </div>
        </ProjectModalWrap>
    );
};

export default ProjectModal;