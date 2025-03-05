package handler

import (
	"net/http"
	"portfolio/internal/utils"
	"portfolio/pages"
)

func Links(w http.ResponseWriter, r *http.Request) {
	utils.RenderPage(w, r, pages.Links(), pages.LinksMeta())
}
