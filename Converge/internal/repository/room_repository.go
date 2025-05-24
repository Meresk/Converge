package repository

import (
	"Converge/internal/model"
	"gorm.io/gorm"
)

type RoomRepository interface {
	Create(room *model.Room) error
	FindAll() ([]*model.Room, error)
	FindAllByOwnerID(ownerID int64, onlyOpen bool) ([]*model.Room, error)
	GetById(id int64) (*model.Room, error)
	Update(room *model.Room) error
	FindAllOpen() ([]*model.Room, error)
	Delete(id int64) error
}

type roomRepositoryImpl struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) RoomRepository {
	return &roomRepositoryImpl{db: db}
}

func (r *roomRepositoryImpl) FindAllByOwnerID(ownerID int64, onlyOpen bool) ([]*model.Room, error) {
	var rooms []*model.Room

	query := r.db.Where("owner_id = ?", ownerID)
	if onlyOpen {
		query = query.Where("end_at IS NULL")
	}

	err := query.Find(&rooms).Error
	if err != nil {
		return nil, err
	}

	return rooms, err
}

func (r *roomRepositoryImpl) FindAllOpen() ([]*model.Room, error) {
	var rooms []*model.Room
	err := r.db.Where("end_at IS NULL").Find(&rooms).Error
	if err != nil {
		return nil, err
	}

	return rooms, nil
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

func (r *roomRepositoryImpl) Delete(id int64) error {
	return r.db.Delete(&model.Room{}, id).Error
}
