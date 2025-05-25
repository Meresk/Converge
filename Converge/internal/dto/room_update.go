package dto

type RoomUpdateRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}
