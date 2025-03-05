package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	router "portfolio/internal"
)

// Set to production at build time used to determine what assets to load.
var Environment = "development"

func main() {
	os.Setenv("env", Environment)

	if Environment != "production" {
		err := exec.Command("make", "tailwind-build").Run()

		if err != nil {
			fmt.Println("Executing tailwind-build failed unexpectedly.")
		}
	}

	fmt.Println("Listening on :8080")
	http.ListenAndServe(":8080", router.Router())
}
