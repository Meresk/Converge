package repository

import (
	"Converge/internal/model"
	"gorm.io/gorm"
)

type RoleRepository interface {
	GetByID(int64) (*model.Role, error)
	Create(*model.Role) error
	FindAll() ([]*model.Role, error)
	Delete(int64) error
	Update(*model.Role) error
}

type roleRepositoryImpl struct{ db *gorm.DB }

func NewRoleRepository(db *gorm.DB) RoleRepository {
	return &roleRepositoryImpl{db: db}
}

func (r *roleRepositoryImpl) GetByID(id int64) (*model.Role, error) {
	role := model.Role{}
	if err := r.db.First(&role, id).Error; err != nil {
		return nil, err
	}

	return &role, nil
}

func (r *roleRepositoryImpl) Create(role *model.Role) error {
	return r.db.Create(role).Error
}

func (r *roleRepositoryImpl) FindAll() ([]*model.Role, error) {
	var roles []*model.Role
	if err := r.db.Find(&roles).Error; err != nil {
		return nil, err
	}

	return roles, nil
}

func (r *roleRepositoryImpl) Delete(id int64) error {
	return r.db.Delete(&model.Role{}, id).Error
}

func (r *roleRepositoryImpl) Update(role *model.Role) error {
	return r.db.Save(role).Error
}
