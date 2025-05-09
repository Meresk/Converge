package repository

import (
	"Converge/internal/model"
	"gorm.io/gorm"
)

type RoomRepository interface {
	Create(room *model.Room) error
	FindAll() ([]*model.Room, error)
	GetById(id int64) (*model.Room, error)
	Update(room *model.Room) error
}

type roomRepositoryImpl struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) RoomRepository {
	return &roomRepositoryImpl{db: db}
}

func (r *roomRepositoryImpl) Create(room *model.Room) error {
	return r.db.Create(room).Error
}

func (r *roomRepositoryImpl) FindAll() ([]*model.Room, error) {
	var rooms []*model.Room
	err := r.db.Find(&rooms).Error
	if err != nil {
		return nil, err
	}

	return rooms, nil
}

func (r *roomRepositoryImpl) GetById(id int64) (*model.Room, error) {
	var room model.Room
	if err := r.db.First(&room, id).Error; err != nil {
		return nil, err
	}

	return &room, nil
}

func (r *roomRepositoryImpl) Update(room *model.Room) error {
	return r.db.Save(room).Error
}
