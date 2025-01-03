import {Request , Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/dbpool';

// 로그인 , 회원가입 하고 비밀번호 찾기

//사용자 유효성 검증
//이름과 이메일로 사용자 있는지 체크
export const vaildateUser = async (req:Request , res:Response): Promise<void> =>{
    const {uname , email} = req.body;
    try {
        // 사용자 검색
        const [rows]:any = await pool.query(
            'select * from User where uname = ? and email = ?',
            [uname , email]
        );
        //사용자 있는지에 따른 응답코드
        if(rows.length > 0){
            res.status(200).json({ valid: true });
        } else {
            res.status(404).json({ valid: false });
        }
    } catch (error) {
        console.error('사용자 검증 중 오류 발생:', error);
        res.status(500).json({ valid: false });
    }
}

//비밀번호 찾기/변경 함수
//이름과 이메일로 사용자 확인 후 새 비밀번호로 업데이트
export const findUserPassword = async(req:Request , res:Response): Promise<void> =>{
    const {uname , email , newpw} = req.body;

    try {
        // 사용자 검색
        const [rows]:any = await pool.query(
            'select * from User where uname = ? and email = ?',
            [uname , email]
        )
        if(rows.length === 0){
            // return res.status(404).json({message :'사용자 없음'});
            res.status(404).json({message :'사용자 없음'});
        }
        // 새 비밀번호 해시화
        const hashNewPw = await bcrypt.hash(newpw,10);

        // 비밀번호 업데이트
        await pool.query(
            'update User set passwd = ? where uname = ? and email = ?',
            [hashNewPw , uname , email]
        );

        res.status(200).json({message:'비밀번호가 성공적으로 변경되었습니다.'})

    } catch (error) {
        res.status(500).json({message:'비밀번호 변경 중 오류가 발생했습니다.'})
    }
}

 // ---------------------------------------------------------------------------------------------------

// (프로필) 비밀번호 변경파트

// 현재 비밀번호 확인
// jwt 토큰으로 사용자 인증 후 현재 비밀번호 일치 하는지 체크
 export const checkCurrentPw = async(req:Request , res:Response) : Promise<void> =>{
    const {currentPw} = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    // 입력값 검증
    if (!currentPw) {
        res.status(400).json({ valid: false, message: '비밀번호를 입력해주세요.' });
        return;
    }

    if(!token){
        res.status(401).json({message : '인증 토큰이 필요합니다.'});
        return;
    }
    try {
        //jwt 토큰 검증 및 사용자 정보 추출
        const decoded = jwt.verify(token,'accessSecretKey') as {uid:string};

        //DB에서 현재 사용자의 비밀번호 해시 가져오기
        const [rows]:any = await pool.query(
            'select passwd from User where uid = ?',
            [decoded.uid]
        );

        //사용자가 없는경우
        if(!rows || rows.length === 0){
            res.status(404).json({valid : false});
            return;
        }

        // 저장된 해시 비밀번호가 없는경우
        if (!rows[0].passwd) {
            console.log('No password hash found');
            res.status(400).json({ valid: false, message: '비밀번호 정보가 없습니다.' });
            return;
        }

        // // 비밀번호 비교
        const isValid = await bcrypt.compare(currentPw , rows[0].passwd);
        res.json({valid:isValid});

        //더미데이터도 다 비교함 나중에 지우는거 ******
        // const isValid = currentPw === rows[0].passwd;
        // res.json({valid: isValid});  // 이 응답 부분이 필요합니다

    } catch (error) {
            
        console.error('비밀번호 확인 중 오류: ',error);
        res.status(500).json({valid : false});
    }
 };
 
// 비밀번호 변경 함수
// 현재 비밀번호 확인 후 새 비밀번호로 업데이트
 export const changePw = async(req:Request , res:Response):Promise<void> =>{
    const {currentPw , newpw} = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    // 입력값 검증
    if (!currentPw || !newpw) {
        res.status(400).json({ message: '모든 비밀번호 필드를 입력해주세요.' });
        return;
    }

    if(!token){
        res.status(401).json({message:'인증 토큰이 필요합니다.'});
        return;
    }
    try {
        const decoded = jwt.verify(token,'accessSecretKey') as {uid:string};

        const [user]:any = await pool.query(
            'select passwd from User where uid = ? ',
            [decoded.uid]
        );

        const isValid = await bcrypt.compare(currentPw,user[0].passwd);
        if(!isValid){
            res.status(400).json({message:'현재 비밀번호가 일치하지 않습니다.'});
            return;
        }

        // 새 비밀번호 해시화 
        const hashNewPasswd = await bcrypt.hash(newpw,10);

        // 비밀번호 업데이트
        await pool.query(
            'update User set passwd = ? where uid = ?',
            [hashNewPasswd , decoded.uid]
        );
        res.status(200).json({message:'비밀번호가 성공적으로 변경되었습니다.'});


        //------------------------------------------------
        // 나중에 삭제

          // 더미데이터이므로 직접 비교
        //   const isValid = currentPw === user[0].passwd;
        //   if(!isValid){
        //       res.status(400).json({message:'현재 비밀번호가 일치하지 않습니다.'});
        //       return;
        //   }
  
        //   // 새 비밀번호 저장 (해시화 없이)
        //   await pool.query(
        //       'update User set passwd = ? where uid = ?',
        //       [newpw, decoded.uid]  // newpw를 그대로 저장
        //   );
        //   res.status(200).json({message:'비밀번호가 성공적으로 변경되었습니다.'});

        // --------------------------------------------------


    } catch (error) {
        console.error('비밀번호 변경 중 오류 :',error);
        res.status(500).json({message:'비밀번호 변경중 오류가 발생했습니다.'})
        
    }
 }


