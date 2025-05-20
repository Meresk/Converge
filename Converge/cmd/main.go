package main

import (
	"Converge/internal/config"
	"Converge/internal/database"
	"Converge/internal/handler"
	"Converge/internal/middleware"
	"Converge/internal/repository"
	"Converge/internal/seed"
	"Converge/internal/service"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Загрузка конфигурации
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// Подключение к БД
	db, err := database.NewConnection(cfg.DatabaseDSN)
	if err != nil {
		log.Fatalf("Error with database connection: %v", err)
	}

	// Миграции БД
	err = database.Migrate(db)
	if err != nil {
		log.Fatalf("Error with database migration: %v", err)
	}

	// Сидинг дефолтных данных в БД
	err = seed.Run(db)
	if err != nil {
		log.Fatalf("Seeding failed: %v", err)
	}

	// Репозитории
	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)
	roomRepo := repository.NewRoomRepository(db)
	participantRepo := repository.NewParticipantRepository(db)

	// Сервисы
	userSvc := service.NewUserService(userRepo, roleRepo)
	roleSvc := service.NewRoleService(roleRepo)
	roomSvc := service.NewRoomService(roomRepo, participantRepo, cfg.LiveKitApiKey, cfg.LiveKitApiSecret)
	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)

	// Хэндлеры
	userH := handler.NewUserHandler(userSvc)
	roleH := handler.NewRoleHandler(roleSvc)
	roomH := handler.NewRoomHandler(roomSvc, cfg.JWTSecret)
	authH := handler.NewAuthHandler(authSvc)

	// Middlewares
	authMW := middleware.NewAuthMiddleware(cfg.JWTSecret)

	// Fiber и CORS
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowOrigins,
		AllowHeaders:     cfg.AllowHeaders,
		AllowMethods:     cfg.AllowMethods,
		AllowCredentials: true,
	}))

	// Маршруты
	userH.Register(app, authMW.RequireAdmin())
	roleH.Register(app)
	roomH.Register(app, authMW.RequireTeacher())
	authH.Register(app)

	// Запуск сервера
	addr := fmt.Sprintf(":%s", cfg.Port)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Error starting app: %v", err)
	}
}
