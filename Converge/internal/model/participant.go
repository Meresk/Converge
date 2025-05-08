package model

import "time"

type Participant struct {
	ID       int64     `gorm:"primary_key"`
	RoomID   int64     `gorm:"index; not null"`
	Nickname string    `gorm:"not null"`
	JoinedAt time.Time `gorm:"autoCreateTime"`
}
