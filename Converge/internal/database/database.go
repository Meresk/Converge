package database

import (
	"Converge/internal/model"
	"errors"
	"github.com/gofiber/fiber/v2/log"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func NewConnection(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Errorf("Error connecting to database: %v", err)
		return nil, err
	}

	return db, nil
}

func Migrate(db *gorm.DB) error {
	if db == nil {
		return errors.New("database instance is nil")
	}

	if err := db.AutoMigrate(&model.User{}, &model.Role{}, &model.Room{}, &model.Participant{}, &model.Message{}); err != nil {
		return errors.New("migration failed")
	}

	return nil
}
