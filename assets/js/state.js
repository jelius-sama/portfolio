const createCounter = () => {
    let count = 0;

    return {
        getCount: () => count,
        setCount: (newCount) => count = newCount
    };
};

export const counter = createCounter();

const createThemeStore = () => {
    const THEME_KEY = "theme";

    const getTheme = () => localStorage.getItem(THEME_KEY) || "system";
    const setTheme = (newTheme) => {
        localStorage.setItem(THEME_KEY, newTheme);

        window.dispatchEvent(new Event("themeChange"));
    };

    const themeKey = () => THEME_KEY;

    return { getTheme, setTheme, themeKey };
};

export const themeStore = createThemeStore();
