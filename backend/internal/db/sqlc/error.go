package db

import (
	"errors"

	"github.com/go-sql-driver/mysql"
)

const (
	UniqueViolation = 1062
)

// ErrorCode returns the MYSQL error number if it's a MysqlError
func ErrorCode(err error) uint16 {
	var mysqlErr *mysql.MySQLError
	if errors.As(err, &mysqlErr) {
		return mysqlErr.Number
	}
	return 0
}
