import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  user: { id: string; token: string } | null;
  login: (id: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; token: string } | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    const storedToken = localStorage.getItem("token");

    if (storedId && storedToken) {
      setUser({ id: storedId, token: storedToken });
    }
  }, []);

  const login = (id: string, token: string) => {
    setUser({ id, token });
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
