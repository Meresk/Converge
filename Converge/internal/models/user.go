package models

type User struct {
	ID       int64  `gorm:"primary_key"`
	Login    string `gorm:"type:nvarchar(255);unique;not null"`
	Password string `gorm:"size:255;not null"`

	RoleID int64 `gorm:"not null"`                                      // Внешний ключ
	Role   *Role `gorm:"constraint:OnUpdate:CASCADE;OnDelete:RESTRICT"` // Прямая связь
}
