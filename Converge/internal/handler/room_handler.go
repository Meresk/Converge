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
	g.Get("/", h.GetAll)
	g.Post("/:id/close", onlyTeacher, h.CloseRoom)
	g.Post("/:id/join", h.Join)
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

	ownerID := c.Locals("ownerID").(int64)
	room, err := h.svc.Create(req.Name, req.Password, ownerID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot create room",
		})
	}

	return c.JSON(room)
}

func (h *RoomHandler) GetAll(c *fiber.Ctx) error {
	rooms, err := h.svc.GetAll()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot get rooms",
		})
	}
	return c.JSON(rooms)
}

func (h *RoomHandler) CloseRoom(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "cannot close room",
		})
	}
	ownerID := c.Locals("ownerID").(int64)
	if err := h.svc.CloseRoom(id, ownerID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *RoomHandler) Join(c *fiber.Ctx) error {
	// Реализация входа: проверка пароля, сохранение участника и генерация токена LiveKit
	return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{"error": "not implemented"})
}
