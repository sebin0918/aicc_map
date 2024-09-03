#!/bin/bash

# 데이터 디렉토리를 비우고 초기화
rm -rf /var/lib/mysql/*

# MariaDB 데이터 디렉토리 초기화 (기본 시스템 테이블 생성)
mysql_install_db --user=mysql --datadir=/var/lib/mysql

# MariaDB 서버 시작
mariadbd --user=mysql --console &

# MariaDB가 완전히 시작될 때까지 기다림
until mariadb -u root -p"${MYSQL_ROOT_PASSWORD}" -e "SELECT 1" >/dev/null 2>&1; do
  echo "Waiting for MariaDB to be ready..."
  sleep 5
done

echo "MariaDB is ready. Initializing the database."

# Python 스크립트를 실행하여 데이터베이스 초기화
python3 /docker-entrypoint-initdb.d/MAP_project_DATABASE.py

echo "Database initialization complete."

# MariaDB 서버가 계속 실행되도록 대기
tail -f /dev/null
