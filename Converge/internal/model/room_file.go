package model

import "time"

type RoomFile struct {
	ID        int64     `gorm:"primary_key"`
	RoomID    int64     `gorm:"index;not null"`
	FileName  string    `gorm:"size:255;not null"`
	FilePath  string    `gorm:"size:255;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
