# Этап сборки
FROM golang:1.24.2-alpine AS builder

# Установим необходимые пакеты для сборки
RUN apk add --no-cache git

WORKDIR /app

# Копируем go.mod и go.sum и устанавливаем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY . .

# Собираем бинарник
RUN go build -o main ./cmd/

# Этап запуска
FROM alpine:latest

WORKDIR /root/

# Копируем бинарник и другие нужные файлы
COPY --from=builder /app/main .

# Открываем порт, который использует приложение
EXPOSE 8080

# Запускаем приложение
CMD ["./main"]
