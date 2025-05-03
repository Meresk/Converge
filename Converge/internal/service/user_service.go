package service

import (
	"Converge/internal/model"
	"Converge/internal/repository"
)

type UserService interface {
	GetAll() ([]*model.User, error)
	GetByID(id int64) (*model.User, error)
	Create(input *model.User) (*model.User, error)
}

type userServiceImpl struct {
	userRepo repository.UserRepository
	roleRepo repository.RoleRepository
}

func NewUserService(ur repository.UserRepository, rr repository.RoleRepository) UserService {
	return &userServiceImpl{userRepo: ur, roleRepo: rr}
}

func (s *userServiceImpl) GetAll() ([]*model.User, error) {
	return s.userRepo.FindAll()
}

func (s *userServiceImpl) GetByID(id int64) (*model.User, error) {
	return s.userRepo.GetByID(id)
}

func (s *userServiceImpl) Create(input *model.User) (*model.User, error) {
	if err := s.userRepo.Create(input); err != nil {
		return nil, err
	}

	return input, nil
}
