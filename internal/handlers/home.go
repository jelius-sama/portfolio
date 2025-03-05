package handler

import (
	"net/http"
	"portfolio/internal/utils"
	"portfolio/pages"
)

func Home(w http.ResponseWriter, r *http.Request) {
	utils.RenderPage(w, r, pages.Home(), pages.HomeMeta())
}
