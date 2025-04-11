import { createContext, FC, ReactNode, useEffect, useState } from "react";
import api from "./api";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
    userId: number | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
};

type JwtPayload = {
    user_id: number;
};

const AuthContext = createContext<AuthContextType>({
    userId: null,
    isLoggedIn: false,
    login: async (_username, _password) => false,
    logout: async () => false
});

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    
    useEffect(() => {
        const access = localStorage.getItem('access-token');
        if (access) {
            try {
                const jwtData = jwtDecode<JwtPayload>(access);
                setUserId(jwtData.user_id);
                setIsLoggedIn(true);
            } catch (error) {
                console.log('Invalid token:', error);

                localStorage.removeItem('access-token');
                localStorage.removeItem('refresh-token');
                setUserId(null);
                setIsLoggedIn(false);
            }
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post('/token', { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('access-token', access);
            localStorage.setItem('refresh-token', refresh);

            const jwtData = jwtDecode<JwtPayload>(access);
            setUserId(jwtData.user_id);
            setIsLoggedIn(true);
            return true;
        } catch (error) {
            console.log('Login failed:', error);
            return false;
        }
    };
    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh-token');
            await api.post('/token/logout', { refresh });
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token');
            setUserId(null);
            setIsLoggedIn(false);
            return true;
        } catch (error) {
            console.log('Logout failed:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ userId, isLoggedIn, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }