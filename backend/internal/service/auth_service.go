package service

import (
	"Converge/internal/model"
	"Converge/internal/repository"
	"errors"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type AuthService interface {
	Authenticate(login, password string) (*model.User, error)
	GenerateToken(user *model.User) (string, error)
}

type authServiceImpl struct {
	userRepo  repository.UserRepository
	jwtSecret string
}

func NewAuthService(r repository.UserRepository, jwtSecret string) AuthService {
	return &authServiceImpl{userRepo: r, jwtSecret: jwtSecret}
}

func (s *authServiceImpl) Authenticate(login, password string) (*model.User, error) {
	user, err := s.userRepo.GetByLogin(login)
	if err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("wrong password")
	}

	return user, nil
}

func (s *authServiceImpl) GenerateToken(user *model.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":  user.ID,
		"role": user.Role.Name,
		"exp":  time.Now().Add(time.Hour * 10).Unix(),
		"iat":  time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(s.jwtSecret))
}
