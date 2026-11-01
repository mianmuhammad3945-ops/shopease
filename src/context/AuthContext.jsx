import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read("shopease_user", null));

  const signup = ({ name, email, password }) => {
    const users = read("shopease_users", []);
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === cleanEmail)) {
      return { ok: false, message: "An account with this email already exists." };
    }
    const newUser = { name: name.trim(), email: cleanEmail, password };
    localStorage.setItem("shopease_users", JSON.stringify([...users, newUser]));
    const session = { name: newUser.name, email: newUser.email };
    localStorage.setItem("shopease_user", JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const users = read("shopease_users", []);
    const found = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, message: "Wrong email or password." };
    const session = { name: found.name, email: found.email };
    localStorage.setItem("shopease_user", JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("shopease_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);