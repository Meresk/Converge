package service

import (
	"Converge/internal/model"
	"Converge/internal/repository"
)

type RoleService interface {
	GetAll() ([]*model.Role, error)
	GetById(id int64) (*model.Role, error)
	Create(*model.Role) (*model.Role, error)
	Delete(id int64) error
	Update(id int64, input *model.Role) (*model.Role, error)
}

type roleServiceImpl struct {
	roleRepo repository.RoleRepository
}

func NewRoleService(rr repository.RoleRepository) RoleService {
	return &roleServiceImpl{roleRepo: rr}
}

func (r *roleServiceImpl) GetAll() ([]*model.Role, error) {
	return r.roleRepo.FindAll()
}

func (r *roleServiceImpl) GetById(id int64) (*model.Role, error) {
	return r.GetById(id)
}

func (r *roleServiceImpl) Create(role *model.Role) (*model.Role, error) {
	if err := r.roleRepo.Create(role); err != nil {
		return nil, err
	}

	return role, nil
}

func (r *roleServiceImpl) Delete(id int64) error {
	return r.roleRepo.Delete(id)
}

func (r *roleServiceImpl) Update(id int64, input *model.Role) (*model.Role, error) {
	existingRole, err := r.roleRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	existingRole.Name = input.Name

	if err := r.roleRepo.Update(existingRole); err != nil {
		return nil, err
	}

	return existingRole, nil
}
