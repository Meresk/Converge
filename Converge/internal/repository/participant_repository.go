package repository

import (
	"Converge/internal/model"
	"gorm.io/gorm"
)

type ParticipantRepository interface {
	Create(*model.Participant) error
}

type participantRepositoryImpl struct{ db *gorm.DB }

func NewParticipantRepository(db *gorm.DB) ParticipantRepository {
	return &participantRepositoryImpl{db: db}
}

func (r *participantRepositoryImpl) Create(participant *model.Participant) error {
	return r.db.Create(participant).Error
}
