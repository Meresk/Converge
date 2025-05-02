package repository

import (
	"Converge/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetByID(int64) (*models.User, error)
	Create(*models.User) error
}

type userRepositoryImpl struct{ db *gorm.DB }

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepositoryImpl{db: db}
}

func (r *userRepositoryImpl) GetByID(id int64) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepositoryImpl) Create(user *models.User) error {
	return r.db.Create(user).Error
}
