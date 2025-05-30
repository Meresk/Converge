#!/bin/bash

set -e

mkdir -p certs && cd certs

echo "[1/6] Генерация корневого ключа CA..."
openssl genrsa -out ca.key 4096

echo "[2/6] Создание самоподписанного CA-сертификата..."
openssl req -x509 -new -nodes -key ca.key \
  -sha256 -days 3650 \
  -subj "/CN=ConvergeLocalRootCA" \
  -out ca.crt

echo "[3/6] Генерация ключа для сервера (LiveKit)..."
openssl genrsa -out converge.key 2048

echo "[4/6] Создание CSR для IP-адреса сервера..."
openssl req -new -key converge.key \
  -subj "/CN=192.168.0.16" \
  -out converge.csr \
  -addext "subjectAltName = IP:192.168.0.16"

echo "[5/6] Подписание CSR через CA..."
openssl x509 -req -in converge.csr \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out converge.crt -days 365 -sha256 \
  -extfile <(printf "subjectAltName = IP:192.168.0.16")

echo "[6/6] Готово. Сертификаты:"
echo "  CA:         certs/ca.crt"
echo "  Сервер key: certs/converge.key"
echo "  Сервер crt: certs/converge.crt"

