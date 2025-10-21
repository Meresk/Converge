package middleware

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"strings"
)

type AuthMiddleware struct {
	Secret string
}

func NewAuthMiddleware(secret string) *AuthMiddleware {
	return &AuthMiddleware{Secret: secret}
}

func (m *AuthMiddleware) authenticate(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if !strings.HasPrefix(auth, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "missing or invalid authorization header",
		})
	}

	tokenStr := strings.TrimPrefix(auth, "Bearer ")
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Unexpected signing method")
		}
		return []byte(m.Secret), nil
	})
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid token",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid claims",
		})
	}
	sub, ok := claims["sub"].(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid sub claim",
		})
	}
	c.Locals("userID", int64(sub))

	role, ok := claims["role"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid role claim",
		})
	}
	c.Locals("role", role)

	return nil
}

func (m *AuthMiddleware) RequireAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := m.authenticate(c); err != nil {
			return err
		}
		return c.Next()
	}
}

func (m *AuthMiddleware) RequireAdmin() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := m.authenticate(c); err != nil {
			return err
		}
		role := c.Locals("role")
		if roleStr, ok := role.(string); !ok || roleStr != "admin" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "admin only"})
		}
		return c.Next()
	}
}

func (m *AuthMiddleware) RequireTeacher() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := m.authenticate(c); err != nil {
			return err
		}
		role := c.Locals("role")
		if roleStr, ok := role.(string); !ok || roleStr != "teacher" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "teacher only"})
		}
		return c.Next()
	}
}
