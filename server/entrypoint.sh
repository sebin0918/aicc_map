#!/bin/bash

# 데이터베이스가 준비될 때까지 최대 60초 대기 (최대 30번 시도)
TRIES=0
MAX_TRIES=30

until mysqladmin ping -h database --silent; do
  TRIES=$((TRIES + 1))
  if [ $TRIES -ge $MAX_TRIES ]; then
    echo "데이터베이스가 준비되지 않았습니다. 서버를 시작할 수 없습니다."
    exit 1  # 오류 상태로 종료
  fi
  echo "데이터베이스를 기다리는 중... ($TRIES/$MAX_TRIES)"
  sleep 2
done

echo "데이터베이스가 준비되었습니다. 서버를 시작합니다."

# Node.js 의존성 설치
npm install
npm install nodemailer

# 기존 비밀번호를 해싱하는 스크립트 실행 (필요한 경우)
node join_security/hashExistingPasswords.js

# Python 스크립트를 Node.js 서버 실행 전에 백그라운드에서 실행 (필요할 경우)
# python your_model_script.py &

# Node.js 서버 시작
node app.js
