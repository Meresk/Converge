package models

type Role struct {
	ID   int64  `gorm:"primary_key;"`
	Name string `gorm:"type:nvarchar(255);unique;not null"`
}
