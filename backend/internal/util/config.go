package util

import "github.com/spf13/viper"

// Config stores all configuration of the application.
type Config struct {
	DBDriver       string   `mapstructure:"DB_DRIVER"`
	DBSource       string   `mapstructure:"DB_SOURCE"`
	MigrationURL   string   `mapstructure:"MIGRATION_URL"`
	ServerAddress  string   `mapstructure:"SERVER_ADDRESS"`
	APIToken       string   `mapstructure:"API_TOKEN"`
	AllowedOrigins []string `mapstructure:"ALLOWED_ORIGINS"`
}

// LoadConfig reads configuration from file or environment variables.
func LoadConfig(path string) (config Config, err error) {
	viper.SetConfigFile(path)
	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}
	err = viper.Unmarshal(&config)
	return
}
