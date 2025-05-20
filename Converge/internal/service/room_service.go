package service

import (
	"Converge/internal/model"
	"Converge/internal/repository"
	"errors"
	"github.com/livekit/protocol/auth"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type RoomService interface {
	Create(name, password string, ownerID int64) (*model.Room, error)
	GetAll() ([]*model.Room, error)
	GetById(id int64) (*model.Room, error)
	CloseRoom(id int64, ownerID int64) error
	JoinRoom(roomID int64, nickname, password string, isAuthorized bool) (string, error)
	GetAllOpenRooms() ([]*model.Room, error)
}

type roomService struct {
	roomRepo        repository.RoomRepository
	participantRepo repository.ParticipantRepository
	apiKey          string
	apiSecret       string
}

func NewRoomService(rr repository.RoomRepository, pr repository.ParticipantRepository, apiKey, apiSecret string) RoomService {
	return &roomService{roomRepo: rr, participantRepo: pr, apiKey: apiKey, apiSecret: apiSecret}
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

	p := &model.Participant{
		Nickname: nickname,
		RoomID:   roomID,
		JoinedAt: time.Now(),
	}
	err = s.participantRepo.Create(p)
	if err != nil {
		return "", err
	}

	at := auth.NewAccessToken(s.apiKey, s.apiSecret)
	vg := &auth.VideoGrant{
		RoomJoin:       true,
		Room:           room.Name,
		CanSubscribe:   ptr(true),
		CanPublish:     &isAuthorized,
		CanPublishData: ptr(true),
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

func (s *roomService) GetById(id int64) (*model.Room, error) {
	return s.roomRepo.GetById(id)
}

func (s *roomService) CloseRoom(id int64, ownerID int64) error {
	room, err := s.roomRepo.GetById(id)
	if err != nil {
		return err
	}

	if room.OwnerID == nil || *room.OwnerID != ownerID {
		return errors.New("you are not the owner of the room")
	}
	now := time.Now()
	room.EndAt = &now
	return s.roomRepo.Update(room)
}
