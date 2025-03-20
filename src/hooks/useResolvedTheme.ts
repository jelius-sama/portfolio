import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useResolvedTheme() {
    const { theme } = useTheme();
    const [resolvedTheme, setResolvedTheme] = useState(theme);

    useEffect(() => {
        // If theme is undefined, check HTML class first, then fall back to preferred color scheme
        if (theme === undefined || theme === "system") {
            const htmlElement = document.documentElement;
            const htmlClass = htmlElement.className;

            if (htmlClass.includes('dark')) {
                setResolvedTheme('dark');
                return;
            } else if (htmlClass.includes('light')) {
                setResolvedTheme('light');
                return;
            }

            // Fall back to preferred color scheme
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
