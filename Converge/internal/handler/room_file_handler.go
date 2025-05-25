package handler

import (
	"Converge/internal/service"
	"github.com/gofiber/fiber/v2"
	"path/filepath"
	"strconv"
)

type RoomFileHandler struct {
	fileService service.RoomFileService
	roomService service.RoomService
}

func NewRoomFileHandler(fileService service.RoomFileService, roomService service.RoomService) *RoomFileHandler {
	return &RoomFileHandler{fileService: fileService, roomService: roomService}
}

func (h *RoomFileHandler) Register(app *fiber.App, onlyTeacher fiber.Handler) {
	g := app.Group("/api/files")
	g.Get("/", h.GetFilesByRoom)                // ?room_id=123 — получить файлы комнаты
	g.Post("/", onlyTeacher, h.UploadFile)      // ?room_id=123 — загрузить файл в комнату
	g.Get("/:id", h.DownloadFile)               // скачать файл по id
	g.Delete("/:id", onlyTeacher, h.DeleteFile) // удалить файл по id
}

func (h *RoomFileHandler) UploadFile(c *fiber.Ctx) error {
	roomID, err := strconv.ParseInt(c.Query("room_id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid room_id",
		})
	}

	roomExist, err := h.roomService.GetById(roomID)
	if err != nil && roomExist == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "file not found in request",
		})
	}

	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "failed to open file"})
	}
	defer file.Close()

	fileBytes := make([]byte, fileHeader.Size)
	_, err = file.Read(fileBytes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to read file",
		})
	}

	savedFile, err := h.fileService.UploadFile(roomID, fileHeader.Filename, fileBytes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(savedFile)
}

func (h *RoomFileHandler) DeleteFile(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid id",
		})
	}

	err = h.fileService.Delete(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to delete file",
		})
	}

	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *RoomFileHandler) DownloadFile(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid id",
		})
	}

	content, filename, err := h.fileService.GetFile(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	c.Set("Content-Disposition", "attachment; filename=\""+filename+"\"")
	c.Type(filepath.Ext(filename))
	return c.Send(content)
}

func (h *RoomFileHandler) GetFilesByRoom(c *fiber.Ctx) error {
	roomID, err := strconv.ParseInt(c.Query("room_id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid room_id",
		})
	}

	files, err := h.fileService.GetAllFilesByRoomID(roomID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.JSON(files)
}
