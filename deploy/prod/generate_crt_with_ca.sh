#!/bin/bash

set -e

mkdir -p certs && cd certs

# Автоматическое определение IP-адреса
echo "[0/6] Определение IP-адреса..."
SERVER_IP=$(hostname -I | awk '{print $1}')
# Альтернативные варианты, если предыдущая команда не работает:
# SERVER_IP=$(ip route get 1 | awk '{print $7}' | head -1)
# SERVER_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)

echo "Используется IP-адрес: $SERVER_IP"

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
  -subj "/CN=$SERVER_IP" \
  -out converge.csr \
  -addext "subjectAltName = IP:$SERVER_IP"

echo "[5/6] Подписание CSR через CA..."
openssl x509 -req -in converge.csr \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -out converge.crt -days 365 -sha256 \
  -extfile <(printf "subjectAltName = IP:$SERVER_IP")

echo "[6/6] Готово. Сертификаты:"
echo "  CA:         certs/ca.crt"
echo "  Сервер key: certs/converge.key"
echo "  Сервер crt: certs/converge.crt"
echo "  IP-адрес:   $SERVER_IP"