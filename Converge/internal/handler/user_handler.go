package handler

import (
	"Converge/internal/model"
	"Converge/internal/service"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

type UserHandler struct {
	svc service.UserService
}

func NewUserHandler(s service.UserService) *UserHandler {
	return &UserHandler{svc: s}
}

func (h *UserHandler) Register(app *fiber.App, adminOnly fiber.Handler) {
	g := app.Group("/api/users", adminOnly)
	g.Get("/", h.GetAll)
	g.Get("/:id", h.GetByID)
	g.Post("/", h.Create)
	g.Delete("/:id", h.Delete)
	g.Put("/:id", h.Update)
}

func (h *UserHandler) GetAll(c *fiber.Ctx) error {
	users, err := h.svc.GetAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(users)
}

func (h *UserHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid id",
		})
	}

	user, err := h.svc.GetByID(idInt)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	return c.JSON(user)
}

func (h *UserHandler) GetByLogin(c *fiber.Ctx) error {
	login := c.Query("login")
	user, err := h.svc.GetByLogin(login)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "user not found",
		})
	}

	return c.JSON(user)
}

func (h *UserHandler) Create(c *fiber.Ctx) error {
	var input model.User
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

func (h *UserHandler) Delete(c *fiber.Ctx) error {
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

func (h *UserHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	idInt, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid id",
		})
	}

	var input model.User
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	updated, err := h.svc.Update(idInt, &input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(updated)
}
