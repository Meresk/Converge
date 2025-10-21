package seed

import (
	"Converge/internal/model"
	"errors"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Run(db *gorm.DB) error {
	// Список ролей для создания
	defaultRoles := []string{"admin", "teacher"}

	for _, roleName := range defaultRoles {
		var role model.Role
		err := db.Where("name = ?", roleName).First(&role).Error

		// Если роль уже существует, пропускаем
		if err == nil {
			continue
		}

		// Если ошибка не связана с отсутствием записи
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("failed to check role %s: %v", roleName, err)
		}

		// Создаем роль и пользователя в транзакции
		txErr := db.Transaction(func(tx *gorm.DB) error {
			role := model.Role{Name: roleName}
			if err := tx.Create(&role).Error; err != nil {
				return err
			}

			// Для admin создаем дефолтного пользователя
			if roleName == "admin" {
				hashPassword, err := bcrypt.GenerateFromPassword(
					[]byte("admin"),
					bcrypt.DefaultCost,
				)
				if err != nil {
					return fmt.Errorf("failed to hash password: %v", err)
				}

				adminUser := model.User{
					Login:    "admin",
					Password: string(hashPassword),
					RoleID:   role.ID,
				}

				if err := tx.Create(&adminUser).Error; err != nil {
					return err
				}
			}

			return nil
		})

		if txErr != nil {
			return txErr
		}
	}

	return nil
}
