import { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkmode, setDarkmode] = useState(false);
    return (
        <ThemeContext.Provider value={{ darkmode, setDarkmode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}