package main

import (
	"Converge/internal/config"
	"Converge/internal/handler"
	"Converge/internal/model"
	"Converge/internal/repository"
	"Converge/internal/service"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// Загрузка конфигурации
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// Подключение к БД и миграции
	db, err := gorm.Open(mysql.Open(cfg.DatabaseDSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	if err := db.AutoMigrate(&model.User{}, &model.Role{}); err != nil {
		log.Fatalf("Error migrating database: %v", err)
	}

	// Создание роли admin и пользователя admin
	var count int64
	db.Model(&model.Role{}).Where("name = ?", "admin").Count(&count)
	if count == 0 {
		adminRole := model.Role{Name: "admin"}
		db.Create(&adminRole)

		hashPassword, _ := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
		adminUser := model.User{
			Login:    "admin",
			Password: string(hashPassword),
			RoleID:   adminRole.ID,
		}
		db.Create(&adminUser)
	}

	// Репозитории
	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)

	// Сервисы
	userSvc := service.NewUserService(userRepo, roleRepo)
	roleSvc := service.NewRoleService(roleRepo)
	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)

	// Хэндлеры
	userH := handler.NewUserHandler(userSvc)
	roleH := handler.NewRoleHandler(roleSvc)
	authH := handler.NewAuthHandler(authSvc)

	//authMW := middleware.NewAuthMiddleware(cfg.JWTSecret)

	// Fiber и маршруты
	app := fiber.New()
	//app.Use("/api/users", authMW.RequireAdmin())
	//app.Use("/api/roles", authMW.RequireAdmin())
	userH.Register(app)
	roleH.Register(app)
	authH.Register(app)

	// Запуск сервера
	addr := fmt.Sprintf(":%d", cfg.Port)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Error starting app: %v", err)
	}
}
