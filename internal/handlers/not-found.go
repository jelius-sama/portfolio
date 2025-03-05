package handler

import (
	"net/http"
	"portfolio/internal/utils"
	"portfolio/pages"
)

func NotFound(w http.ResponseWriter, r *http.Request) {
	utils.RenderPage(w, r, pages.NotFound(), pages.NotFoundMeta())
}
