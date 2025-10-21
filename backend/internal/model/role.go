package model

type Role struct {
	ID   int64  `gorm:"primary_key;" json:"id"`
	Name string `gorm:"type:nvarchar(255);unique;not null" json:"name"`
}
