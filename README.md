# AICC MAP PROJECT README 
1. Client = React
2. Server = Node.js
3. Client : 3000  /  Server : 5000  (front는 보통 3000 , node는 5000)

※ 주의 사항 ※
프롬프트 창을 두개를 열어서 각각 client와 server npm을 다르게 실행해줘야해요!

## 처음 실행전 database 작업

1. map_database 폴더로 이동
2. Mariadb 실행
3. 'data_to_exel.ipynb' 실행 - 데이터 생성
4. 'MAP_project_DATABASE.ipynb' 실행 - 데이터 적재

## front - client 시작 방법

1. cd (프로젝트의 client폴더 경로)
2. `npm install` 
3. `npm install recharts`
4. `npm install fullcalendar` `npm install @fullcalendar/react`
5. `npm install framer-motion`
6. `npm start`
// 필요시 아래까지 
7. react 환경설정 `.env` file.

## back - server 시작 방법

1. cd (프로젝트의 server 폴더경로)
2. `npm install`
3. `npm install nodemailer`
4. `node join_security/hashExistingPasswords.js`
5. ctrl + c 
6. `node app.js`

## DB 설정 변경 방법
1. server폴더의 `.env`
2. 프로젝트 db 세부설정 (자신의 db password로 변경)