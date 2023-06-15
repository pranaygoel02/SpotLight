import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export default function UserProvider({ children }) {
    
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('spotlight-user')));   


    const value = {
        userInfo,
        setUserInfo
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext);
}