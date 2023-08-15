import { err, ok } from "neverthrow";
import { useEffect } from "react";
import { FC, ReactNode, createContext, useState } from "react";

import { Data } from "@/extension/context/data";
import { API_BASE_URL } from "@/extension/lib/constants";
import { parseError } from "@/utils/parse-error";

interface AdminContextValue {
  admin: Data<{ isLoggedIn: true; password: string } | { isLoggedIn: false }>;
  login: (password: string) => void;
  logout: () => void;
  isChecking: boolean;
}

export const AdminContext = createContext<AdminContextValue>({
  admin: { isReady: false },
  login: () => {},
  logout: () => {},
  isChecking: false,
});

const loadPassword = () => {
  const password = localStorage.getItem("admin");
  return password || null;
};

const checkPassword = async (adminPassword: string) => {
  try {
    const url = new URL("/api/admin/login", API_BASE_URL);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-admin-api-key": adminPassword,
      },
    });

    if (response.status === 200) {
      return ok(true);
    } else if (response.status === 401) {
      return ok(false);
    }
    return err(new Error(`Failed to check admin auth. Status code: ${response.status}`));
  } catch (e) {
    return parseError(e);
  }
};

const savePassword = (password: string | null) => {
  if (!password) {
    localStorage.removeItem("admin");
    return;
  }
  localStorage.setItem("admin", password);
};

export const AdminContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminContextValue["admin"]>({ isReady: false });

  const [isChecking, setIsChecking] = useState(false);

  const login = (password: string) => {
    setIsChecking(true);
    checkPassword(password).then((res) => {
      if (res.isErr()) {
        console.error(res.error);
        alert(`Failed to check admin auth. Error: ${res.error.message}`);
      } else {
        if (res.value) {
          savePassword(password);
          setAdmin({ isReady: true, value: { isLoggedIn: true, password } });
        } else {
          alert("Incorrect password");
        }
      }
      setIsChecking(false);
    });
  };

  const logout = () => {
    savePassword(null);
  };

  useEffect(() => {
    const password = loadPassword();
    if (password) {
      setAdmin({ isReady: true, value: { isLoggedIn: true, password } });
    } else {
      setAdmin({ isReady: true, value: { isLoggedIn: false } });
    }
  }, [loadPassword, setAdmin]);

  return (
    <AdminContext.Provider value={{ admin, login, logout, isChecking }}>
      {children}
    </AdminContext.Provider>
  );
};
