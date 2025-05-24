package handler

import (
	"Converge/internal/dto"
	"Converge/internal/service"
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"strconv"
	"strings"
)

type RoomHandler struct {
	svc       service.RoomService
	jwtSecret string
}

func NewRoomHandler(svc service.RoomService, jwtSecret string) *RoomHandler {
	return &RoomHandler{svc: svc, jwtSecret: jwtSecret}
}

func (h *RoomHandler) Register(app *fiber.App, onlyTeacher fiber.Handler, onlyAdmin fiber.Handler) {
	g := app.Group("/api/rooms")
	g.Post("/", onlyTeacher, h.Create)
	g.Get("/", onlyAdmin, h.GetAll)
	g.Get("/own", onlyTeacher, h.GetAllOwnRooms)
	g.Get("/open", h.GetAllOpenRooms)
	g.Post("/:id/toggle-status", onlyTeacher, h.ToggleRoomStatus)
	g.Post("/join", h.Join)
	g.Put("/:id", onlyTeacher, h.Update)
	g.Delete("/:id", onlyTeacher, h.Delete)
}

func (h *RoomHandler) Create(c *fiber.Ctx) error {
	var req struct {
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid body",
		})
	}

	ownerID := c.Locals("userID").(int64)
	room, err := h.svc.Create(req.Name, req.Password, ownerID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"id":          room.ID,
		"name":        room.Name,
		"ownerID":     room.OwnerID,
		"isProtected": room.Password != "",
		"startsAt":    room.StartsAt,
		"endAt":       room.EndAt,
	})
}

func (h *RoomHandler) Update(c *fiber.Ctx) error {
	ownerID := c.Locals("userID").(int64)
	roomID := c.Params("id")
	roomIDInt, err := strconv.ParseInt(roomID, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid room id",
		})
	}

	var input dto.RoomUpdateRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid body",
		})
	}

	updated, err := h.svc.Update(roomIDInt, ownerID, &input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"id":          updated.ID,
		"name":        updated.Name,
		"ownerID":     updated.OwnerID,
		"isProtected": updated.Password != "",
		"startsAt":    updated.StartsAt,
		"endAt":       updated.EndAt,
	})
}

func (h *RoomHandler) GetAll(c *fiber.Ctx) error {
	rooms, err := h.svc.GetAll()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot get rooms",
		})
	}

	response := make([]fiber.Map, len(rooms))
	for i, room := range rooms {
		response[i] = fiber.Map{
			"id":          room.ID,
			"name":        room.Name,
			"ownerID":     room.OwnerID,
			"isProtected": room.Password != "",
			"startsAt":    room.StartsAt,
			"endAt":       room.EndAt,
		}
	}

	return c.JSON(response)
}

func (h *RoomHandler) GetAllOwnRooms(c *fiber.Ctx) error {
	ownerID := c.Locals("userID").(int64)
	onlyOpen := c.QueryBool("onlyOpen", false)

	rooms, err := h.svc.GetAllByOwnerID(ownerID, onlyOpen)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot get rooms",
		})
	}

	response := make([]fiber.Map, len(rooms))
	for i, room := range rooms {
		response[i] = fiber.Map{
			"id":          room.ID,
			"name":        room.Name,
			"ownerID":     room.OwnerID,
			"isProtected": room.Password != "",
			"startsAt":    room.StartsAt,
			"endAt":       room.EndAt,
		}
	}

	return c.JSON(response)
}

func (h *RoomHandler) GetAllOpenRooms(c *fiber.Ctx) error {
	rooms, err := h.svc.GetAllOpenRooms()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot get rooms",
		})
	}

	response := make([]fiber.Map, len(rooms))
	for i, room := range rooms {
		response[i] = fiber.Map{
			"id":          room.ID,
			"name":        room.Name,
			"ownerID":     room.OwnerID,
			"isProtected": room.Password != "",
			"startsAt":    room.StartsAt,
			"endAt":       room.EndAt,
		}
	}

	return c.JSON(response)
}

func (h *RoomHandler) ToggleRoomStatus(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot close room",
		})
	}
	ownerID := c.Locals("userID").(int64)
	if err := h.svc.ToggleRoomStatus(id, ownerID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *RoomHandler) Join(c *fiber.Ctx) error {
	var req struct {
		Id       int64  `json:"id"`
		Nickname string `json:"nickname"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid body",
		})
	}

	authHeader := c.Get("Authorization")
	isAuthorized := false
	if authHeader != "" {
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("Unexpected signing method")
			}
			return []byte(h.jwtSecret), nil
		})
		if err == nil || token.Valid {
			isAuthorized = true
		}
	}

	token, err := h.svc.JoinRoom(req.Id, req.Nickname, req.Password, isAuthorized)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{"token": token})
}

func (h *RoomHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid id",
		})
	}
	err = h.svc.Delete(idInt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}
