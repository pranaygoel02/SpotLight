import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
    
    const [theme, setTheme] = useState('light');

    const toggleTheme = (e) => {
        e?.preventDefault();
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }

    const value = {
        theme,
        toggleTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext);
}