import { useContext, createContext, useState, useEffect } from "react";
import type { User } from "@/types";
import { queryClient } from "./react-query-provider";
import { useLocation, useNavigate } from "react-router";
import { publicRoutes } from "@/lib";

// 1. Define the shape of your context
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data : any) => Promise<void>;
    logout: () => Promise<void>;
}

// 2. Create the actual context with default `undefined`
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // agr false kroge toh reload krna pr routes change hote dikhenge 

    const navigate = useNavigate();
    const currentPath = useLocation().pathname
    const isPublicRoute = publicRoutes.includes(currentPath);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            const userInfo = localStorage.getItem("user"); // or use cookies if you prefer

            if (userInfo) {
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);

            } else {
                setIsAuthenticated(false);
                if (!isPublicRoute) {
                    navigate("/sign-in");
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    useEffect(() => {
      const handleLogout = () => {
        logout();
        navigate("/sign-in");
      }
      window.addEventListener("force-logout" , handleLogout);
      return () => {
        window.removeEventListener("force-logout",handleLogout);
      }
    }, [])
    


    const login = async (data: any) => {
        // console.log(email , password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setIsAuthenticated(false);
        queryClient.clear();
    };

    return <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}> {children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
