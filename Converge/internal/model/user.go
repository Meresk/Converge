package model

type User struct {
	ID       int64  `gorm:"primary_key" json:"id"`
	Login    string `gorm:"type:nvarchar(255);unique;not null" json:"login"`
	Password string `gorm:"size:255;not null" json:"password"`

	RoleID int64 `gorm:"not null" json:"roleID"`                                    // Внешний ключ
	Role   *Role `gorm:"constraint:OnUpdate:CASCADE;OnDelete:RESTRICT" json:"role"` // Прямая связь
}
