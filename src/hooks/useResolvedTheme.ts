import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useResolvedTheme() {
    const { theme } = useTheme();
    const [resolvedTheme, setResolvedTheme] = useState(theme);

    useEffect(() => {
        // If theme is undefined, rely on the preferred color scheme
        if (theme === undefined) {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

            const handleChange = () => {
                setResolvedTheme(mediaQuery.matches ? "dark" : "light");
            };

            // Initial check and listener setup
            handleChange();
            mediaQuery.addEventListener("change", handleChange);

            return () => mediaQuery.removeEventListener("change", handleChange);
        }

        // If theme is defined, use it directly
        setResolvedTheme(theme);
    }, [theme]);

    return resolvedTheme;
}
