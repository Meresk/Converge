package hadler

import (
	"Converge/internal/model"
	"Converge/internal/service"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

type RoleHandler struct {
	svc service.RoleService
}

func NewRoleHandler(svc service.RoleService) *RoleHandler {
	return &RoleHandler{svc: svc}
}

func (h *RoleHandler) Register(app *fiber.App) {
	g := app.Group("/api/roles")
	g.Get("/", h.GetAll)
	g.Get("/:id", h.GetByID)
	g.Post("/", h.Create)
}

func (h *RoleHandler) GetAll(c *fiber.Ctx) error {
	roles, err := h.svc.GetAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(roles)
}

func (h *RoleHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid id",
		})
	}

	role, err := h.svc.GetById(idInt)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "role not found",
		})
	}

	return c.JSON(role)
}

func (h *RoleHandler) Create(c *fiber.Ctx) error {
	var input model.Role
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	created, err := h.svc.Create(&input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(created)
}
