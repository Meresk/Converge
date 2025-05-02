package repository

import (
	"Converge/internal/models"
	"gorm.io/gorm"
)

type RoleRepository interface {
	GetByID(int64) (*models.Role, error)
	Create(*models.Role) error
}

type roleRepositoryImpl struct{ db *gorm.DB }

func NewRoleRepository(db *gorm.DB) RoleRepository {
	return &roleRepositoryImpl{db: db}
}

func (r *roleRepositoryImpl) GetByID(id int64) (*models.Role, error) {
	role := models.Role{}
	if err := r.db.First(&role, id).Error; err != nil {
		return nil, err
	}

	return &role, nil
}

func (r *roleRepositoryImpl) Create(role *models.Role) error {
	return r.db.Create(role).Error
}
