package service

import (
	"Converge/internal/dto"
	"Converge/internal/model"
	"Converge/internal/repository"
	"context"
	"errors"
	"github.com/livekit/protocol/auth"
	"github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go/v2"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type RoomService interface {
	Create(name, password string, ownerID int64) (*model.Room, error)
	GetAll() ([]*model.Room, error)
	GetById(id int64) (*model.Room, error)
	ToggleRoomStatus(id int64, ownerID int64) error
	JoinRoom(roomID int64, nickname, password string, isAuthorized bool) (string, error)
	GetAllOpenRooms() ([]*model.Room, error)
	GetAllByOwnerID(ownerID int64, onlyOpen bool) ([]*model.Room, error)
	Update(id int64, ownerID int64, input *dto.RoomUpdateRequest) (*model.Room, error)
	Delete(id int64) error
}

type roomService struct {
	roomRepo  repository.RoomRepository
	apiKey    string
	apiSecret string
	lkClient  *lksdk.RoomServiceClient
}

func NewRoomService(rr repository.RoomRepository, apiKey, apiSecret string, lkCl *lksdk.RoomServiceClient) RoomService {
	return &roomService{roomRepo: rr, apiKey: apiKey, apiSecret: apiSecret, lkClient: lkCl}
}

func (s *roomService) GetAllOpenRooms() ([]*model.Room, error) {
	return s.roomRepo.FindAllOpen()
}

func (s *roomService) JoinRoom(roomID int64, nickname, password string, isAuthorized bool) (string, error) {
	room, err := s.roomRepo.GetById(roomID)
	if err != nil {
		return "", errors.New("room Not Found")
	}

	if room.Password != "" {
		if err := bcrypt.CompareHashAndPassword([]byte(room.Password), []byte(password)); err != nil {
			return "", errors.New("wrong room password")
		}
	}

	resp, err := s.lkClient.ListParticipants(context.Background(), &livekit.ListParticipantsRequest{
		Room: room.Name,
	})
	if err != nil {
		return "", errors.New("failed to check participants")
	}
	for _, p := range resp.Participants {
		if p.Identity == nickname {
			return "", errors.New("user with this nickname already in room")
		}
	}

	at := auth.NewAccessToken(s.apiKey, s.apiSecret)
	vg := &auth.VideoGrant{
		RoomJoin:       true,
		Room:           room.Name,
		CanSubscribe:   ptr(true),
		CanPublish:     &isAuthorized,
		CanPublishData: &isAuthorized,
	}
	at.SetVideoGrant(vg).SetIdentity(nickname).SetValidFor(8 * time.Hour)

	token, err := at.ToJWT()
	if err != nil {
		return "", err
	}

	return token, nil
}

func ptr[T any](v T) *T {
	return &v
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

func (s *roomService) GetAllByOwnerID(ownerID int64, onlyOpen bool) ([]*model.Room, error) {
	return s.roomRepo.FindAllByOwnerID(ownerID, onlyOpen)
}

func (s *roomService) GetById(id int64) (*model.Room, error) {
	return s.roomRepo.GetById(id)
}

func (s *roomService) ToggleRoomStatus(id int64, ownerID int64) error {
	room, err := s.roomRepo.GetById(id)
	if err != nil {
		return err
	}

	if room.OwnerID == nil || *room.OwnerID != ownerID {
		return errors.New("you are not the owner of the room")
	}

	if room.EndAt != nil {
		room.EndAt = nil
	} else {
		now := time.Now()
		room.EndAt = &now
	}

	return s.roomRepo.Update(room)
}

func (s *roomService) Update(id int64, ownerID int64, input *dto.RoomUpdateRequest) (*model.Room, error) {
	room, err := s.roomRepo.GetById(id)
	if err != nil {
		return nil, err
	}

	if room.OwnerID == nil || *room.OwnerID != ownerID {
		return nil, errors.New("you are not the owner of the room")
	}

	room.Name = input.Name
	if input.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		room.Password = string(hash)
	}

	if err = s.roomRepo.Update(room); err != nil {
		return nil, err
	}

	return room, nil
}

func (s *roomService) Delete(id int64) error {
	return s.roomRepo.Delete(id)
}
