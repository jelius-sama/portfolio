package handler

import (
	"net/http"
	"portfolio/internal/utils"
	"portfolio/pages"
)

func Analytics(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "World"
	}
	utils.RenderPage(w, r, pages.Analytics(name), pages.AnalyticsMeta())
}
