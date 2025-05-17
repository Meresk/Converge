package repository

import (
	"Converge/internal/model"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetByLogin(login string) (*model.User, error)
	GetByID(int64) (*model.User, error)
	Create(*model.User) error
	FindAll() ([]*model.User, error)
	Delete(int64) error
	Update(*model.User) error
}

type userRepositoryImpl struct{ db *gorm.DB }

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepositoryImpl{db: db}
}

func (r *userRepositoryImpl) GetByLogin(login string) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Role").Where("login = ?", login).First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepositoryImpl) GetByID(id int64) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Role").First(&user, id).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *userRepositoryImpl) Create(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *userRepositoryImpl) FindAll() ([]*model.User, error) {
	var users []*model.User
	if err := r.db.Preload("Role").Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func (r *userRepositoryImpl) Delete(id int64) error {
	return r.db.Delete(&model.User{}, id).Error
}

func (r *userRepositoryImpl) Update(user *model.User) error {
	return r.db.Preload("Role").Save(user).Error
}
