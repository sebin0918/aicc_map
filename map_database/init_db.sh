#!/bin/bash

if [ ! -f /var/lib/mysql/init_completed ]; then
  python /docker-entrypoint-initdb.d/MAP_project_DATABASE.py
  touch /var/lib/mysql/init_completed
fi
