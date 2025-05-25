package config

import (
	"github.com/joho/godotenv"
	"os"
)

type Config struct {
	LiveKitApiKey    string `env:"LIVEKIT_API_KEY,required"`
	LiveKitApiSecret string `env:"LIVEKIT_API_SECRET,required"`
	LiveKitServerURL string `env:"LIVEKIT_SERVER_URL,required"`

	DatabaseDSN string `env:"DATABASE_DSN,required"`
	JWTSecret   string `env:"JWT_SECRET_KEY,required"`
	Port        string `env:"APP_PORT,required,default=8080"`
	StoragePath string `env:"STORAGE_PATH,required"`

	AllowOrigins string `env:"CORS_ALLOW_ORIGINS,required"`
	AllowMethods string `env:"CORS_ALLOW_METHODS,default=GET,POST,PUT,DELETE"`
	AllowHeaders string `env:"CORS_ALLOW_HEADERS,default=Content-Type,Authorization"`
}

func LoadConfig() (*Config, error) {
	_ = godotenv.Load() // dev only

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080" // дефолт
	}

	cfg := &Config{
		LiveKitApiKey:    os.Getenv("LIVEKIT_API_KEY"),
		LiveKitApiSecret: os.Getenv("LIVEKIT_API_SECRET"),
		LiveKitServerURL: os.Getenv("LIVEKIT_SERVER_URL"),
		DatabaseDSN:      os.Getenv("DATABASE_DSN"),
		JWTSecret:        os.Getenv("JWT_SECRET_KEY"),
		Port:             port,
		AllowOrigins:     os.Getenv("CORS_ALLOW_ORIGINS"),
		AllowMethods:     os.Getenv("CORS_ALLOW_METHODS"),
		AllowHeaders:     os.Getenv("CORS_ALLOW_HEADERS"),
		StoragePath:      os.Getenv("STORAGE_PATH"),
	}

	return cfg, nil

	//var cfg Config
	//if err := envconfig.Process("", &cfg); err != nil {
	//	return nil, err
	//}
	//
	//return &cfg, nil
}
