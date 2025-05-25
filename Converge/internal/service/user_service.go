package service

import (
	"Converge/internal/model"
	"Converge/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	GetAll() ([]*model.User, error)
	GetByLogin(login string) (*model.User, error)
	GetByID(id int64) (*model.User, error)
	Create(input *model.User) (*model.User, error)
	Delete(id int64) error
	Update(id int64, input *model.User) (*model.User, error)
}

type userServiceImpl struct {
	userRepo repository.UserRepository
	roleRepo repository.RoleRepository
}

func NewUserService(ur repository.UserRepository, rr repository.RoleRepository) UserService {
	return &userServiceImpl{userRepo: ur, roleRepo: rr}
}

func (s *userServiceImpl) GetByLogin(login string) (*model.User, error) {
	return s.userRepo.GetByLogin(login)
}

func (s *userServiceImpl) GetAll() ([]*model.User, error) {
	return s.userRepo.FindAll()
}

func (s *userServiceImpl) GetByID(id int64) (*model.User, error) {
	return s.userRepo.GetByID(id)
}

func (s *userServiceImpl) Create(input *model.User) (*model.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	input.Password = string(hashedPassword)

	err = s.userRepo.Create(input)
	if err != nil {
		return nil, err
	}

	return input, nil
}

func (s *userServiceImpl) Delete(id int64) error {
	return s.userRepo.Delete(id)
}

func (s *userServiceImpl) Update(id int64, input *model.User) (*model.User, error) {
	existingUser, err := s.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	existingUser.Login = input.Login
	existingUser.RoleID = input.RoleID
	existingUser.Name = input.Name
	existingUser.Surname = input.Surname
	existingUser.Patronymic = input.Patronymic

	if input.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		existingUser.Password = string(hashedPassword)
	}

	err = s.userRepo.Update(existingUser)
	if err != nil {
		return nil, err
	}

	return existingUser, nil
}
