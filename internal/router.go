package router

import (
	"net/http"
	handler "portfolio/internal/handlers"
	"portfolio/internal/middleware"
	"portfolio/internal/utils"
)

var routeMap = map[string]http.Handler{
	"/":          http.HandlerFunc(handler.Home),
	"/links":     http.HandlerFunc(handler.Links),
	"/analytics": http.HandlerFunc(handler.Analytics),
	"/assets/":   http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))),
}

func Router() http.Handler {
	return utils.ChainMiddlewares(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if handler, exists := routeMap[r.URL.Path]; exists {
			handler.ServeHTTP(w, r)
			return
		}

		if len(r.URL.Path) >= 8 && r.URL.Path[:8] == "/assets/" {
			routeMap["/assets/"].ServeHTTP(w, r)
			return
		}

		handler.NotFound(w, r)
	}),
		middleware.RecoverMiddleware,
		middleware.LoggerMiddleware,
	)
}
