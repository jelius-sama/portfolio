package utils

import (
	"net/http"
	"portfolio/templates"

	"github.com/a-h/templ"
)

// RenderPage handles both full page rendering and HTMX partial updates.
func RenderPage(w http.ResponseWriter, r *http.Request, page templ.Component, meta templ.Component) {
	if r.Header.Get("HX-Request") == "true" {
		if r.Header.Get("HX-Trigger") == "updateMetaRequest" {
			// Send only the `<head>` metadata
			templ.Handler(meta).ServeHTTP(w, r)
		} else {
			// Send only the `<main>` content and trigger a metadata update
			w.Header().Set("HX-Trigger", "updateMeta")
			templ.Handler(page).ServeHTTP(w, r)
		}
		return
	}

	// Full page load with layout
	templ.Handler(templates.Layout(templates.LayoutProp{
		Page: page,
		Meta: meta,
	})).ServeHTTP(w, r)
}
