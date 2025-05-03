package config

import (
	"github.com/joho/godotenv"
	"os"
	"strconv"
)

type Config struct {
	LiveKitApiKey    string `env:"LIVEKIT_API_KEY,required"`
	LiveKitApiSecret string `env:"LIVEKIT_API_SECRET,required"`
	LiveKitServerURL string `env:"LIVEKIT_SERVER_URL,required"`

	DatabaseDSN string `env:"DATABASE_DSN,required"`
	JWTSecret   string `env:"JWT_SECRET_KEY,required"`
	Port        int    `env:"APP_PORT,required,default=8080"`
}

func LoadConfig() (*Config, error) {
	_ = godotenv.Load() // dev only

	portStr := os.Getenv("APP_PORT")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		port = 8080 // дефолт
	}

	cfg := &Config{
		LiveKitApiKey:    os.Getenv("LIVEKIT_API_KEY"),
		LiveKitApiSecret: os.Getenv("LIVEKIT_API_SECRET"),
		LiveKitServerURL: os.Getenv("LIVEKIT_SERVER_URL"),
		DatabaseDSN:      os.Getenv("DATABASE_DSN"),
		JWTSecret:        os.Getenv("JWT_SECRET_KEY"),
		Port:             port,
	}

	return cfg, nil

	//var cfg Config
	//if err := envconfig.Process("", &cfg); err != nil {
	//	return nil, err
	//}
	//
	//return &cfg, nil
}
