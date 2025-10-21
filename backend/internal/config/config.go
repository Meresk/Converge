package config

import (
	"os"

	"github.com/gofiber/fiber/v2/log"
)

type Config struct {
	Port             string
	LiveKitApiKey    string
	LiveKitApiSecret string
	LiveKitServerURL string
	DatabaseDSN      string
	JWTSecret        string
	StoragePath      string
	AllowOrigins     string
	AllowMethods     string
	AllowHeaders     string
}

func Load() *Config {
	cfg := &Config{
		Port:             getEnv("APP_PORT", "8080"),
		LiveKitApiKey:    getEnv("LIVEKIT_API_KEY", "devkey"),
		LiveKitApiSecret: getEnv("LIVEKIT_API_SECRET", "secret"),
		LiveKitServerURL: getEnv("LIVEKIT_SERVER_URL", "http://localhost:7880"),
		DatabaseDSN:      getEnv("DATABASE_DSN", "user:user@tcp(localhost:3307)/converge_app?parseTime=true"),
		JWTSecret:        getEnv("JWT_SECRET_KEY", "DEVELOP_JWT_SECRET_KEY"),
		StoragePath:      getEnv("STORAGE_PATH", "./storage"),
		AllowOrigins:     getEnv("CORS_ALLOW_ORIGINS", "http://localhost:8080,http://localhost:5173"),
		AllowMethods:     getEnv("CORS_ALLOW_METHODS", "GET,POST,PUT,DELETE"),
		AllowHeaders:     getEnv("CORS_ALLOW_HEADERS", "Content-Type,Authorization"),
	}

	log.Info("=== Loaded Configuration ===")
	log.Infof("Database DSN: %s", cfg.DatabaseDSN)
	log.Infof("LIVEKIT SERVER URL: %s", cfg.LiveKitServerURL)
	log.Infof("CORS allow origins: %s", cfg.AllowOrigins)

	return cfg
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
