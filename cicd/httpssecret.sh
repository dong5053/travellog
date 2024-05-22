#!/bin/bash

# 정의된 변수
KEY_FILE="travel.key"
CSR_FILE="travel.csr"
CERT_FILE="travel.crt"
NAMESPACE="frontend-ns"

# RSA 개인 키 생성
openssl genrsa -out $KEY_FILE 2048

# CSR 생성
openssl req -new -key $KEY_FILE -out $CSR_FILE -subj "/CN=frontend.travellog.io,backend.travellog.io" -addext "subjectAltName=DNS:frontend.travellog.io,DNS:backend.travellog.io"

# 자체 서명된 인증서 생성
openssl x509 -req -days 365 -in $CSR_FILE -signkey $KEY_FILE -out $CERT_FILE -extfile <(printf "subjectAltName=DNS:frontend.travellog.io,DNS:backend.travellog.io")

# Kubernetes에 TLS 시크릿 생성
kubectl create secret tls travel-secret --key $KEY_FILE --cert $CERT_FILE -n $NAMESPACE
# chmod +x httpssecret