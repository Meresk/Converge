package repository

import (
	"Converge/internal/model"
	"gorm.io/gorm"
)

type RoomFileRepository interface {
	Save(file *model.RoomFile) error
	Find(id int64) (*model.RoomFile, error)
	FindByRoomID(roomID int64) (*model.RoomFile, error)
	FindAllByRoomID(roomID int64) ([]*model.RoomFile, error)
	FindByRoomIdAndFileName(roomID int64, fileName string) (*model.RoomFile, error)
	Delete(id int64) error
}

type roomFileRepositoryImpl struct {
	db *gorm.DB
}

func NewRoomFileRepository(db *gorm.DB) RoomFileRepository {
	return &roomFileRepositoryImpl{db: db}
}

func (r *roomFileRepositoryImpl) Save(file *model.RoomFile) error {
	return r.db.Create(file).Error
}

func (r *roomFileRepositoryImpl) Find(id int64) (*model.RoomFile, error) {
	var file model.RoomFile
	if err := r.db.First(&file, id).Error; err != nil {
		return nil, err
	}

	return &file, nil
}

func (r *roomFileRepositoryImpl) FindByRoomID(roomID int64) (*model.RoomFile, error) {
	var file model.RoomFile
	if err := r.db.Where("room_id = ?", roomID).First(&file).Error; err != nil {
		return nil, err
	}

	return &file, nil
}

func (r *roomFileRepositoryImpl) FindAllByRoomID(roomID int64) ([]*model.RoomFile, error) {
	var files []*model.RoomFile
	if err := r.db.Where("room_id = ?", roomID).Find(&files).Error; err != nil {
		return nil, err
	}

	return files, nil
}

func (r *roomFileRepositoryImpl) FindByRoomIdAndFileName(roomID int64, fileName string) (*model.RoomFile, error) {
	var file model.RoomFile
	if err := r.db.Where("room_id = ? AND file_name = ?", roomID, fileName).First(&file).Error; err != nil {
		return nil, err
	}
	return &file, nil
}

func (r *roomFileRepositoryImpl) Delete(id int64) error {
	return r.db.Delete(&model.RoomFile{}, id).Error
}
