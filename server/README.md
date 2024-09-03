# My Asset Plan Server

This project is built with Node.js and Express. It provides APIs for managing user data, stock information, and economic indicators.

## 시작 방법

1. `cd (프로젝트의 server 폴더경로)`
2. `npm install`
3. `node app.js`

## 이건 그냥 참고만하세요

1. Install dependencies: `npm install`
2. Start the server: `node app.js`
3. Environment variables are set in the `.env` file.

## API Endpoints

- GET / - Basic endpoint to test server status
- More endpoints will be added for users, stocks, and other data.

## folder 구성 

- ai_models : 예측 모델이나 ai관련 로직 
- controllers : 비즈니스 로직 처리 , db 조회 및 업데이트 등을 수행, routes 에서 라우팅된 요청 처리 
- routes : 클라이언트 요청 url 정의, 해당 요청을 controller에 전달 
- config : db 설정 및 api key 
- middlewares : 인증, 로깅 처리 등의 요청처리를 위한 공통로직 관리 폴더