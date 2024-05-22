#!/bin/bash

MIGRATE_COMMAND="python manage.py migrate"
RUNSERVER_COMMAND="python manage.py runserver 0.0.0.0:8000"

RETRY_COUNT=10
FAILED_COUNT=0

while [ $FAILED_COUNT -lt $RETRY_COUNT ]; do
    $MIGRATE_COMMAND
    if [ $? -eq 0 ]; then
        echo "success"
        $RUNSERVER_COMMAND
        exit 0
    else
        echo "fail"
        sleep 10
        FAILED_COUNT=$((FAILED_COUNT+1))
    fi
done

exit 1
