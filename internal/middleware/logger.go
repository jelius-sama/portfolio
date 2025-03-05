package middleware

import (
	"log"
	"net/http"
	"time"
)

func LoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Visited: %s | Method: %s | Time: %s\n", r.URL.Path, r.Method, time.Now().Format(time.RFC3339))
		next.ServeHTTP(w, r)
	})
}
