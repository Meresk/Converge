# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

# Устанавливаем зависимости и собираем проект
RUN npm install
RUN npm run build

# Этап запуска (используем сервер serve)
FROM node:20-alpine

WORKDIR /app

# Устанавливаем минимальный http-сервер
RUN npm install -g serve

# Копируем билд из предыдущего этапа
COPY --from=builder /app/dist ./dist

# Открываем порт, на котором будет доступен фронт
EXPOSE 5173

# Запускаем статический сервер
CMD ["serve", "-s", "dist", "-l", "5173"]
