package repository

import (
	"Converge/internal/model"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetByID(int64) (*model.User, error)
	Create(*model.User) error
	FindAll() ([]*model.User, error)
}

type userRepositoryImpl struct{ db *gorm.DB }

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepositoryImpl{db: db}
}

func (r *userRepositoryImpl) GetByID(id int64) (*model.User, error) {
	var user model.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepositoryImpl) Create(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *userRepositoryImpl) FindAll() ([]*model.User, error) {
	var users []*model.User
	if err := r.db.Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}
