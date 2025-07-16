import {useContext, createContext, useState } from "react";
import type { User } from "@/types";

// 1. Define the shape of your context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Create the actual context with default `undefined`
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children : React.ReactNode }) => {
    const [user , setUser] = useState<User | null>(null);
    const[isAuthenticated , setIsAuthenticated] = useState(false);
    const [isLoading , setIsLoading] = useState(false);

    const login = async (email: string,password: string) => {
        console.log(email , password);
    };

    const logout = async () => {
        console.log("logout");
    };

    return <AuthContext.Provider value={{user , isAuthenticated , isLoading , login , logout}}> {children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
