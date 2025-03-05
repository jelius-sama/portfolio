APP_NAME ?= portfolio

.PHONY: tailwind-watch
tailwind-watch:
	./bin/dev/tailwindcss -i ./assets/css/tw.css -o ./assets/css/index.css --watch

.PHONY: tailwind-build
tailwind-build:
	./bin/dev/tailwindcss -i ./assets/css/tw.css -o ./assets/css/index.min.css --minify

.PHONY: templ-watch
templ-watch:
	templ generate --watch

.PHONY: templ-generate
templ-generate:
	templ generate
	
.PHONY: dev
dev:
	templ generate --watch --cmd="air"

.PHONY: build
build:
	make tailwind-build
	make templ-generate
	go build -ldflags "-X main.Environment=production" -o ./bin/prod/$(APP_NAME) ./cmd/main.go
