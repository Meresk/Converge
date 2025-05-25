package model

import "time"

type RoomFile struct {
	ID        int64     `gorm:"primary_key" json:"id"`
	RoomID    int64     `gorm:"index;not null" json:"room_id"`
	FileName  string    `gorm:"size:255;not null" json:"file_name"`
	FilePath  string    `gorm:"size:255;not null" json:"file_path"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
