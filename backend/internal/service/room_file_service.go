package service

import (
	"Converge/internal/model"
	"Converge/internal/repository"
	"fmt"
	"os"
	"path/filepath"
)

type RoomFileService interface {
	UploadFile(roomID int64, fileName string, data []byte) (*model.RoomFile, error)
	GetFile(id int64) ([]byte, string, error)
	GetAllFilesByRoomID(roomID int64) ([]*model.RoomFile, error)
	Delete(id int64) error
}

type roomFileServiceImpl struct {
	repo       repository.RoomFileRepository
	storageDir string
}

func NewRoomFileService(repo repository.RoomFileRepository, storageDir string) RoomFileService {
	return &roomFileServiceImpl{repo: repo, storageDir: storageDir}
}

func (s *roomFileServiceImpl) UploadFile(roomID int64, fileName string, data []byte) (*model.RoomFile, error) {
	existing, err := s.repo.FindByRoomIdAndFileName(roomID, fileName)
	if err == nil && existing != nil {
		return nil, fmt.Errorf("file %s already exists in this room", fileName)
	}

	roomPath := filepath.Join(s.storageDir, fmt.Sprintf("rooms/%d", roomID))
	if err := os.MkdirAll(roomPath, os.ModePerm); err != nil {
		return nil, err
	}

	filePath := filepath.Join(roomPath, fileName)
	if err := os.WriteFile(filePath, data, 0644); err != nil {
		return nil, err
	}

	file := &model.RoomFile{
		RoomID:   roomID,
		FileName: fileName,
		FilePath: filePath,
	}
	if err := s.repo.Save(file); err != nil {
		return nil, err
	}

	return file, nil
}

func (s *roomFileServiceImpl) GetAllFilesByRoomID(roomID int64) ([]*model.RoomFile, error) {
	return s.repo.FindAllByRoomID(roomID)
}

func (s *roomFileServiceImpl) Delete(id int64) error {
	file, err := s.repo.Find(id)
	if err != nil {
		return err
	}

	if err := os.Remove(file.FilePath); err != nil {
		return err
	}

	return s.repo.Delete(id)
}

func (s *roomFileServiceImpl) GetFile(id int64) ([]byte, string, error) {
	file, err := s.repo.Find(id)
	if err != nil {
		return nil, "", err
	}

	content, err := os.ReadFile(file.FilePath)
	if err != nil {
		return nil, "", err
	}

	return content, file.FileName, nil
}
