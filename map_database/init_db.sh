#!/bin/bash

# MariaDB 데이터 디렉토리 초기화 및 서버 시작
echo "Initializing MariaDB data directory and starting MariaDB server..."

# MariaDB 서버 시작
/usr/bin/mariadbd --user=mysql --datadir=/var/lib/mysql &  # 비루트 사용자로 MariaDB 서버 시작

# MariaDB 준비 완료 대기
echo "Waiting for MariaDB to be ready..."
sleep 10

# MariaDB 서버 상태 확인
echo "Checking MariaDB server status..."
mariadb-admin -u root -p root1234 status  # 클라이언트 도구를 사용하여 MariaDB 상태 확인

# Python 스크립트 실행
echo "Running Python script..."
python3 /docker-entrypoint-initdb.d/MAP_project_DATABASE.py
