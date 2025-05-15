package handler

import (
	"Converge/internal/service"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

type RoomHandler struct {
	svc service.RoomService
}

func NewRoomHandler(svc service.RoomService) *RoomHandler {
	return &RoomHandler{svc: svc}
}

func (h *RoomHandler) Register(app *fiber.App, onlyTeacher fiber.Handler) {
	g := app.Group("/api/rooms")
	g.Post("/", onlyTeacher, h.Create)
	g.Get("/", onlyTeacher, h.GetAll)
	g.Get("/open", h.GetAllOpenRooms)
	g.Post("/:id/close", onlyTeacher, h.CloseRoom)
	g.Post("/join", h.Join)
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
			"error": "cannot create room",
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

func (h *RoomHandler) CloseRoom(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot close room",
		})
	}
	ownerID := c.Locals("userID").(int64)
	if err := h.svc.CloseRoom(id, ownerID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// TODO: сделать разделение по ролям для разных грантов, предположительно можно отправлять за учиетля на этот запрос заголовок авторизации
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

	token, err := h.svc.JoinRoom(req.Id, req.Nickname, req.Password)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{"token": token})
}
