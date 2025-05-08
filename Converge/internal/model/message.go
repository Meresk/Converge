package model

import "time"

type Message struct {
	ID        int64     `gorm:"primary_key"`
	RoomID    int64     `gorm:"index;not null"`
	Nickname  string    `gorm:"not null"`
	Content   string    `gorm:"type:text;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
