package model

import "time"

type Room struct {
	ID       int64      `gorm:"primary_key"`
	Name     string     `gorm:"size:255;not null"`
	OwnerID  *int64     `gorm:"index"`
	Password string     `gorm:"size:255"`
	StartsAt time.Time  `gorm:"autoCreateTime"`
	EndAt    *time.Time `gorm:""`
	Owner    *User      `gorm:"foreignkey:OwnerID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
