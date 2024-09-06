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

# Python 스크립트를 백그라운드에서 실행 (필요할 경우)
# 예: 모델 관련 스크립트 실행 (주석 제거하여 사용)
# python3 /app/models/your_model_script.py &

# Node.js 서버 시작
node app.js
