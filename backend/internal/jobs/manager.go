package jobs

import (
	"context"
	"sync"
)

var jobs = make(map[int64]context.CancelFunc)
var mu sync.Mutex

func Add(id int64, cancel context.CancelFunc) {
	mu.Lock()
	defer mu.Unlock()
	jobs[id] = cancel
}

func Cancel(id int64) {
	mu.Lock()
	defer mu.Unlock()
	if cancel, exists := jobs[id]; exists {
		cancel()
		delete(jobs, id)
	}
}

func Exists(id int64) bool {
	mu.Lock()
	defer mu.Unlock()
	_, exists := jobs[id]
	return exists
}

func Remove(id int64) {
	mu.Lock()
	defer mu.Unlock()
	delete(jobs, id)
}
