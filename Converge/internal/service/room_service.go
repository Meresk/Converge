package service

import (
	"Converge/internal/model"
	"Converge/internal/repository"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type RoomService interface {
	Create(name, password string, ownerID int64) (*model.Room, error)
	GetAll() ([]*model.Room, error)
	GetById(id int64) (*model.Room, error)
	CloseRoom(id int64, ownerID int64) error
}

type roomService struct {
	roomRepo repository.RoomRepository
}

func NewRoomService(roomRepo repository.RoomRepository) RoomService {
	return &roomService{roomRepo: roomRepo}
}

func (s *roomService) Create(name, password string, ownerID int64) (*model.Room, error) {
	room := &model.Room{
		Name:    name,
		OwnerID: &ownerID,
	}
	if password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		room.Password = string(hash)
	}
	if err := s.roomRepo.Create(room); err != nil {
		return nil, err
	}
	return room, nil
}

func (s *roomService) GetAll() ([]*model.Room, error) {
	return s.roomRepo.FindAll()
}

func (s *roomService) GetById(id int64) (*model.Room, error) {
	return s.roomRepo.GetById(id)
}

func (s *roomService) CloseRoom(id int64, ownerID int64) error {
	room, err := s.roomRepo.GetById(id)
	if err != nil {
		return err
	}

	if room.OwnerID != nil || *room.OwnerID != ownerID {
		return errors.New("you are not the owner of the room")
	}
	now := time.Now()
	room.EndAt = &now
	return s.roomRepo.Update(room)
}
