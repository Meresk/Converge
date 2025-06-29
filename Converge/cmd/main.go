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
	lksdk "github.com/livekit/server-sdk-go/v2"
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

	// LiveKit
	lkClient := lksdk.NewRoomServiceClient(cfg.LiveKitServerURL, cfg.LiveKitApiKey, cfg.LiveKitApiSecret)

	// Репозитории
	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)
	roomRepo := repository.NewRoomRepository(db)
	roomFileRepo := repository.NewRoomFileRepository(db)

	// Сервисы
	userSvc := service.NewUserService(userRepo, roleRepo)
	roleSvc := service.NewRoleService(roleRepo)
	roomSvc := service.NewRoomService(roomRepo, cfg.LiveKitApiKey, cfg.LiveKitApiSecret, lkClient)
	roomFileSvc := service.NewRoomFileService(roomFileRepo, cfg.StoragePath)
	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)

	// Хэндлеры
	userH := handler.NewUserHandler(userSvc)
	roleH := handler.NewRoleHandler(roleSvc)
	roomH := handler.NewRoomHandler(roomSvc, cfg.JWTSecret)
	roomFileH := handler.NewRoomFileHandler(roomFileSvc, roomSvc)
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
	roomH.Register(app, authMW.RequireTeacher(), authMW.RequireAdmin())
	roomFileH.Register(app, authMW.RequireTeacher())
	authH.Register(app)

	// CA
	app.Get("/api/cert", func(c *fiber.Ctx) error {
		filePath := "./ca.crt"

		c.Set("Content-Type", "application/x-pem-file")
		c.Set("Content-Disposition", "attachment; filename=\""+filePath+"\"")

		return c.SendFile(filePath)
	})

	// Запуск сервера
	addr := fmt.Sprintf(":%s", cfg.Port)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Error starting app: %v", err)
	}
}
