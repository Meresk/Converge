package config

import (
	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	LiveKitApiKey    string `env:"LIVE_KIT_API_KEY,required"`
	LiveKitApiSecret string `env:"LIVE_KIT_API_SECRET,required"`
	LiveKitServerURL string `env:"LIVE_KIT_SERVER_URL,required"`

	DatabaseDSN string `env:"DATABASE_DSN,required"`
	JWTSecret   string `env:"JWT_SECRET,required"`
}

func LoadConfig() (*Config, error) {
	_ = godotenv.Load(".env") // dev only

	var cfg Config
	if err := envconfig.Process("", &cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
