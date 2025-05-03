package main

import (
	"Converge/internal/config"
	"Converge/internal/hadler"
	"Converge/internal/model"
	"Converge/internal/repository"
	"Converge/internal/service"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

func main() {
	// Загрузка конфигурации
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// Подключение к базе даных и миграции
	db, err := gorm.Open(mysql.Open(cfg.DatabaseDSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	if err := db.AutoMigrate(&model.User{}, &model.Role{}); err != nil {
		log.Fatalf("Error migrating database: %v", err)
	}

	// Репозитории
	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)

	// Сервисы
	userSvc := service.NewUserService(userRepo, roleRepo)
	roleSvc := service.NewRoleService(roleRepo)

	// Хэндлеры
	userH := hadler.NewUserHandler(userSvc)
	roleH := hadler.NewRoleHandler(roleSvc)

	// Fiber и маршруты
	app := fiber.New()
	userH.Register(app)
	roleH.Register(app)

	// Запуск сервера
	addr := fmt.Sprintf(":%d", cfg.Port)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Error starting app: %v", err)
	}
}
