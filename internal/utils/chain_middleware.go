package utils

import "net/http"

// ChainMiddlewares applies multiple middlewares in order.
func ChainMiddlewares(handler http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	for _, mw := range middlewares {
		handler = mw(handler)
	}
	return handler
}
