FROM python:3.12.2-alpine

RUN apk --no-cache add \
        gcc \
        libc-dev \
        libffi-dev \
        mariadb-connector-c-dev \
    && pip install --upgrade pip \
    && pip install mysqlclient

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

WORKDIR /app/back_jango

RUN chmod +x /app/run.sh

EXPOSE 8000

CMD ["/bin/sh", "/app/run.sh"]
